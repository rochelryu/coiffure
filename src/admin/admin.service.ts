import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from './admin.entity';
import { Between, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { ResponseProvider } from 'src/Common/Interfaces/ResponseInterface';
import {
  ProfessionelInput,
  AdminInterfaceInput,
  ServiceInput,
  FactureInput,
} from './admin.input';
import { compare, hash } from 'bcrypt';

import { generateRecoveryForHelp } from 'src/Common/Functions/Helpers';
import { FacturesEntity } from './entity/facture.entity';
import { ServiceEntity } from './entity/service.entity';
import { ProfessionalsEntity } from './entity/professional.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
    @InjectRepository(FacturesEntity)
    private facturesRepository: Repository<FacturesEntity>,
    @InjectRepository(ServiceEntity)
    private serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(ProfessionalsEntity)
    private professionalsRepository: Repository<ProfessionalsEntity>,
  ) {}

  async createAdmin(
    admin: AdminInterfaceInput,
    level = 1,
  ): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.adminRepository
        .findOne({
          where: { contact: admin.contact },
        })
        .then(async (res) => {
          if (res) {
            next({
              etat: false,
              error: new Error(
                "ce contact appartient déjà à l'administrateur " +
                  res.firstname,
              ),
            });
          } else {
            const { contact, password, firstname } = admin;
            const recovery = await generateRecoveryForHelp();
            const pass = await hash(
              password.trim(),
              Number(process.env.CRYPTO_DIGEST),
            );
            await this.adminRepository
              .save({
                firstname,
                contact,
                recovery,
                password: pass,
                sexe: admin.sexe,
                level,
              })
              .then((result) => {
                const { firstname, sexe, id, recovery, level } = result;
                next({
                  etat: true,
                  result: { firstname, sexe, id, recovery, level },
                });
              })
              .catch((error) => next({ etat: false, error: error }));
          }
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async getAllAdmin(): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.adminRepository
        .find()
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async getAllAdminByItem(item): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.adminRepository
        .find({ where: item })
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async getOneAdminByItem(item): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.adminRepository
        .findOne({ where: item })
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async getAllProfessional(): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.professionalsRepository
        .find()
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async getAllProfessionalByItem(item): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.professionalsRepository
        .find({ where: item })
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }
  async getOneProfessionalByItem(item): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.professionalsRepository
        .findOne({ where: item })
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async getAllFacture(): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.facturesRepository
        .find()
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async getAllFactureByDate(
    date: Date,
    nextDate: Date,
  ): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.facturesRepository
        .find({
          where: { create_at: Between(date, nextDate) },
        })
        .then((result) => {
          const sumPrice =
            result.length === 0
              ? 0
              : result.reduce(
                  (total, facture) => total + facture.priceFinal,
                  0,
                );
          next({ etat: true, result: sumPrice });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async getAllFactureByDateAndProfessionalOrService(
    date: Date,
    nextDate: Date,
    item,
  ): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.facturesRepository
        .find({
          where: { create_at: Between(date, nextDate), ...item },
        })
        .then((result) => {
          next({ etat: true, result: result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async getAllFactureByItem(item): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.facturesRepository
        .find({ where: item })
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }
  async getOneFactureByItem(item): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.facturesRepository
        .findOne({ where: item })
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async getAllService(): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.serviceRepository
        .find()
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }
  async getAllServiceByItem(item): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.serviceRepository
        .find({ where: item })
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }
  async getOneServiceByItem(item): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.serviceRepository
        .findOne({ where: item })
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async deleteAdmin(id: string): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.adminRepository
        .findOne({ where: { id } })
        .then(async (result) => {
          if (result) {
            const res = result;
            await this.adminRepository.remove(result);
            next({ etat: true, result: res });
          } else {
            next({
              etat: false,
              error: new Error("Cette Demande n'est pas en attente"),
            });
          }
        })
        .catch((error) =>
          next({
            etat: false,
            error,
          }),
        );
    });
  }

  async verifyAdmin(
    contact: string,
    password: string,
  ): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.adminRepository
        .findOne({ where: { contact: contact } })
        .then(async (result) => {
          if (result) {
            const state = await compare(password, result.password);
            if (state) {
              result.updated_at = new Date();
              await result.save();
              const { firstname, sexe, id, recovery, level } = result;
              next({
                etat: true,
                result: { firstname, sexe, id, recovery, level },
              });
            } else {
              next({
                etat: false,
                error: new Error('Vérifier le mot de passe'),
              });
            }
          } else {
            next({ etat: false, error: new Error('Vérifier le contact') });
          }
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async updateAdminPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.adminRepository
        .findOne({ where: { id } })
        .then(async (result) => {
          if (result) {
            const state = await compare(oldPassword, result.password);
            if (state) {
              const pass = await hash(
                newPassword.trim(),
                Number(process.env.CRYPTO_DIGEST),
              );
              result.password = pass;
              result.updated_at = new Date();
              await result.save();
              const { firstname, sexe, id, recovery, level } = result;
              next({
                etat: true,
                result: { firstname, sexe, id, recovery, level },
              });
            } else {
              next({
                etat: false,
                error: new Error('Vérifier le mot de passe'),
              });
            }
          } else {
            next({ etat: false, error: new Error('Vérifier le contact') });
          }
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async updateAdminInfo(
    id: string,
    firstname: string,
    contact: string,
    oldPassword: string,
  ): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.adminRepository
        .findOne({ where: { id } })
        .then(async (result) => {
          if (result) {
            const state = await compare(oldPassword, result.password);
            if (state) {
              result.contact = contact.trim();
              result.firstname = firstname.trim();
              result.updated_at = new Date();
              await result.save();
              const { sexe, id, recovery, level } = result;
              next({
                etat: true,
                result: { sexe, id, recovery, level },
              });
            } else {
              next({
                etat: false,
                error: new Error('Vérifier le mot de passe'),
              });
            }
          } else {
            next({ etat: false, error: new Error('Vérifier le contact') });
          }
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async verifyAdminByItem(data: any): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.adminRepository
        .findOne({ where: data })
        .then(async (result) => {
          if (result) {
            next({ etat: true, result });
          } else {
            next({ etat: false, error: new Error('Vérifier les coordonnées') });
          }
        })
        .catch((error) => next({ etat: false, error }));
    });
  }

  async createService(service: ServiceInput): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.serviceRepository
        .save({
          title: service.title.trim(),
          price: parseInt(service.price, 10),
        })
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error: error }));
    });
  }

  async createProfessional(
    professional: ProfessionelInput,
  ): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      await this.professionalsRepository
        .save({
          name: professional.name.trim(),
          contact: professional.contact.trim(),
        })
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error: error }));
    });
  }

  async createFacture(facture: FactureInput): Promise<ResponseProvider> {
    return new Promise(async (next) => {
      const service = await this.serviceRepository.findOne({
        where: { id: facture.serviceId },
      });
      await this.facturesRepository
        .save({
          serviceId: parseInt(facture.serviceId, 10),
          professionalId: parseInt(facture.professionalId, 10),
          priceFinal: service.price,
        })
        .then((result) => {
          next({ etat: true, result });
        })
        .catch((error) => next({ etat: false, error: error }));
    });
  }
}
