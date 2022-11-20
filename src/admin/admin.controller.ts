import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  Request,
} from '@nestjs/common';
import { AdminDTOLogin } from './admin.dto';
import {
  AdminInterfaceInput,
  ServiceInput,
  ProfessionelInput,
  FactureInput,
} from './admin.input';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import * as session from 'express-session';
import { addDays, eachDayOfInterval, format, subDays } from 'date-fns';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/login')
  @ApiResponse({
    status: 201,
    description: 'Connexion admin',
  })
  async loginPost(
    @Body() user: AdminDTOLogin,
    @Res() res: Response,
    @Request() req,
  ) {
    const error = [];
    let state = true;
    if (user.contact.length !== 10) {
      state = false;
      error.push('Veillez entrer un numéro correct');
    }
    if (user.password.length <= 4) {
      state = false;
      error.push('Votre mot de passe est trop court');
    }
    if (state) {
      const dataSave = await this.adminService.verifyAdmin(
        user.contact,
        user.password,
      );

      if (dataSave.etat) {
        req.session.coiffure_royal_babershop = dataSave.result;
        if (dataSave.result.level === 0) {
          return res.redirect('/admin/dashboard');
        } else {
          return res.redirect('/admin/facture');
        }
      } else {
        req.session.flash = [dataSave.error.message];
        res.status(HttpStatus.NOT_ACCEPTABLE).redirect('/admin/login');
      }
    } else if (!state) {
      res.status(HttpStatus.NOT_ACCEPTABLE).redirect('/signin');
    }
  }

  @Post('/createAdmin')
  async signupPost(
    @Body() admin: AdminInterfaceInput,
    @Request() req,
    @Res() res: Response,
  ) {
    if (
      req.session.coiffure_royal_babershop &&
      req.session.coiffure_royal_babershop.level === 0
    ) {
      const error = [];
      let state = true;
      if (admin.firstname.length <= 3) {
        state = false;
        error.push('Veillez entrer un nom correct');
      }
      if (admin.contact.length !== 10) {
        state = false;
        error.push('Veillez entrer un numéro correct');
      }
      if (admin.password.length <= 4) {
        state = false;
        error.push('Votre mot de passe est trop court');
      }
      if (state) {
        await this.adminService.createAdmin(admin);
        res.redirect('/admin/gestionnaires');
      } else if (!state) {
        res.redirect('/admin/gestionnaires');
      }
    } else {
      res.redirect('/admin/login');
    }
  }

  @Post('/addService')
  async addService(
    @Body() service: ServiceInput,
    @Request() req,
    @Res() res: Response,
  ) {
    if (
      req.session.coiffure_royal_babershop &&
      req.session.coiffure_royal_babershop.level === 0
    ) {
      await this.adminService.createService(service);
      res.redirect('/admin/service');
    } else {
      res.redirect('/admin/login');
    }
  }

  @Post('/updatePassword')
  async updatePassword(
    @Body() info: { oldPassword: string; newPassword: string },
    @Request() req,
    @Res() res: Response,
  ) {
    if (req.session.coiffure_royal_babershop) {
      await this.adminService.updateAdminPassword(
        req.session.coiffure_royal_babershop.id.toString(),
        info.oldPassword.trim(),
        info.newPassword.trim(),
      );
      res.redirect('/admin/setting');
    } else {
      res.redirect('/admin/login');
    }
  }

  @Post('/updateInfo')
  async updateInfo(
    @Body() info: { firstname: string; contact: string; password: string },
    @Request() req,
    @Res() res: Response,
  ) {
    if (req.session.coiffure_royal_babershop) {
      await this.adminService.updateAdminInfo(
        req.session.coiffure_royal_babershop.id.toString(),
        info.firstname.trim(),
        info.contact.trim(),
        info.password.trim(),
      );
      res.redirect('/admin/setting');
    } else {
      res.redirect('/admin/login');
    }
  }

  @Post('/addProfessional')
  async addProfessional(
    @Body() professional: ProfessionelInput,
    @Request() req,
    @Res() res: Response,
  ) {
    if (
      req.session.coiffure_royal_babershop &&
      req.session.coiffure_royal_babershop.level === 0
    ) {
      await this.adminService.createProfessional(professional);
      res.redirect('/admin/professional');
    } else {
      res.redirect('/admin/login');
    }
  }

  @Post('/addFacture')
  async addFacture(
    @Body() facture: FactureInput,
    @Request() req,
    @Res() res: Response,
  ) {
    if (req.session.coiffure_royal_babershop) {
      await this.adminService.createFacture(facture);
      res.redirect('/admin/facture');
    } else {
      res.redirect('/admin/login');
    }
  }

  //***********************GET Method */
  @Get('/login')
  loginGet(@Request() req, @Res() res: Response) {
    if (req.session.coiffure_royal_babershop) {
      if (req.session.coiffure_royal_babershop.level === 0) {
        res.redirect('/admin/dashboard');
      } else {
        res.redirect('/admin/facture');
      }
    } else {
      const message = req.session.flash ?? [];
      req.session.destroy();
      res
        .set(
          'Content-Security-Policy',
          "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'",
        )
        .render('login', {
          message,
          title: 'Authentification',
        });
    }
  }

  @Get('/')
  index(@Request() req, @Res() res: Response) {
    if (req.session.coiffure_royal_babershop) {
      if (req.session.coiffure_royal_babershop.level === 0) {
        res.redirect('/admin/dashboard');
      } else {
        res.redirect('/admin/facture');
      }
    } else {
      res.redirect('/admin/login');
    }
  }

  @Get('/dashboard')
  async dashboard(@Request() req, @Res() res: Response) {
    if (req.session.coiffure_royal_babershop) {
      if (req.session.coiffure_royal_babershop.level === 0) {
        const allFacture = await this.adminService.getAllFacture();
        const allGestionnaires = await this.adminService.getAllAdminByItem({
          level: 1,
        });
        const allProfessionals = await this.adminService.getAllProfessional();
        const allServices = await this.adminService.getAllService();
        const actual = new Date();
        const actualDateFormated = new Date(
          actual.getFullYear(),
          actual.getMonth(),
          actual.getDate(),
        );
        const lastDateBackFormated = subDays(actualDateFormated, 30);
        const lastDateFowradFormated = addDays(actualDateFormated, 1);
        const differenceDate = eachDayOfInterval({
          start: lastDateBackFormated,
          end: actualDateFormated,
        });
        const label: string[] = [];
        const valuePriceFinal: number[] = [];
        const professionals: any[] = [];
        const services: any[] = [];
        for (let index = 0; index < differenceDate.length; index++) {
          const date = differenceDate[index];
          const nextDate =
            index === differenceDate.length - 1
              ? lastDateFowradFormated
              : differenceDate[index + 1];
          const { result } = await this.adminService.getAllFactureByDate(
            date,
            nextDate,
          );
          label.push(format(date, 'dd/MMM'));
          valuePriceFinal.push(result);
        }

        for (const professional of allProfessionals.result) {
          const resultToday =
            await this.adminService.getAllFactureByDateAndProfessionalOrService(
              actualDateFormated,
              lastDateFowradFormated,
              { professionalId: professional.id },
            );

          professionals.push({
            name: professional.name,
            contact: professional.contact,
            nbreWork: resultToday.result.length,
          });
        }

        for (const service of allServices.result) {
          const resultToday =
            await this.adminService.getAllFactureByDateAndProfessionalOrService(
              actualDateFormated,
              lastDateFowradFormated,
              { serviceId: service.id },
            );

          services.push({
            title: service.title,
            price: service.price,
            nbreWork: resultToday.result.length,
          });
        }
        res.set(
          'Content-Security-Policy',
          "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'",
        );
        res.render('dashboard', {
          title: 'Tableau de bord',
          level: req.session.coiffure_royal_babershop.level,
          info: {
            allFacture: allFacture.result.length,
            allProfessionals: allProfessionals.result.length,
            allServices: allServices.result.length,
            allGestionnaires: allGestionnaires.result.length,
            professionals,
            services,
            label,
            valuePriceFinal,
          },
        });
      } else {
        res.redirect('/admin/facture');
      }
    } else {
      res.redirect('/admin/login');
    }
  }

  @Get('/gestionnaires')
  async gestionnaires(@Request() req, @Res() res: Response) {
    if (req.session.coiffure_royal_babershop) {
      if (req.session.coiffure_royal_babershop.level === 0) {
        const allAdmins = await this.adminService.getAllAdmin();

        res.set(
          'Content-Security-Policy',
          "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'",
        );
        res.render('gestionnaires', {
          title: 'Gestionnaires',
          info: allAdmins.result,
          level: req.session.coiffure_royal_babershop.level,
        });
      } else {
        res.redirect('/admin/facture');
      }
    } else {
      res.redirect('/admin/login');
    }
  }

  @Get('/setting')
  async setting(@Request() req, @Res() res: Response) {
    if (req.session.coiffure_royal_babershop) {
      const admin = await this.adminService.getOneAdminByItem({
        id: req.session.coiffure_royal_babershop.id,
      });

      res.set(
        'Content-Security-Policy',
        "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'",
      );
      res.render('setting', {
        title: 'setting',
        info: admin.result,
        level: req.session.coiffure_royal_babershop.level,
      });
    } else {
      res.redirect('/admin/login');
    }
  }

  @Get('/service')
  async service(@Request() req, @Res() res: Response) {
    if (req.session.coiffure_royal_babershop) {
      const services = [];
      const allServices = await this.adminService.getAllService();
      for (const service of allServices.result) {
        const allFactures = await this.adminService.getAllFactureByItem({
          serviceId: service.id,
        });
        services.push({
          id: service.id,
          title: service.title,
          price: service.price,
          nbreFacture: allFactures.result.length,
        });
      }
      res.set(
        'Content-Security-Policy',
        "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'",
      );
      res.render('services', {
        title: 'Services',
        info: services,
        level: req.session.coiffure_royal_babershop.level,
      });
    } else {
      res.redirect('/admin/login');
    }
  }

  @Get('/professional')
  async professional(@Request() req, @Res() res: Response) {
    if (req.session.coiffure_royal_babershop) {
      const professionals = [];
      const allProfessionals = await this.adminService.getAllProfessional();
      for (const professional of allProfessionals.result) {
        const allFactures = await this.adminService.getAllFactureByItem({
          professionalId: professional.id,
        });
        professionals.push({
          id: professional.id,
          name: professional.name,
          contact: professional.contact,
          nbreFacture: allFactures.result.length,
        });
      }
      res.set(
        'Content-Security-Policy',
        "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'",
      );
      res.render('professional', {
        title: 'Professionnels',
        info: professionals,
        level: req.session.coiffure_royal_babershop.level,
      });
    } else {
      res.redirect('/admin/login');
    }
  }

  @Get('/facture')
  async facture(@Request() req, @Res() res: Response) {
    if (req.session.coiffure_royal_babershop) {
      const factures = [];
      const allFacture = await this.adminService.getAllFacture();
      const allProfessionals = await this.adminService.getAllProfessional();
      const allServices = await this.adminService.getAllService();
      for (const facture of allFacture.result) {
        const service = await this.adminService.getOneServiceByItem({
          id: facture.serviceId,
        });
        const professional = await this.adminService.getOneProfessionalByItem({
          id: facture.professionalId,
        });
        factures.push({
          id: facture.id,
          service: service.result.title,
          price: facture.priceFinal,
          professional: professional.result.name,
          date: facture.create_at,
        });
      }
      res.set(
        'Content-Security-Policy',
        "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'",
      );
      res.render('facture', {
        title: 'Facture',
        level: req.session.coiffure_royal_babershop.level,
        info: {
          factures: factures.reverse(),
          allProfessionals: allProfessionals.result,
          allServices: allServices.result,
        },
      });
    } else {
      res.redirect('/admin/login');
    }
  }

  @Get('/logout')
  async logout(@Request() req, @Res() res: Response) {
    req.session.destroy();
    res.redirect('/admin/login');
  }
}
