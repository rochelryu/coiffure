import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  NestExpressApplication,
  ExpressAdapter,
} from '@nestjs/platform-express';
import * as session from 'express-session';
import flash = require('connect-flash');
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import 'dotenv/config';
import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as http from 'http';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const logger = new Logger('App Main');

const server = express();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));
	app.setBaseViewsDir(join(__dirname, '..', 'views'));

	// chose engine template
	// hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
	// hbs.registerHelper(helpersHbs);
	app.setViewEngine('ejs');
  app.use(bodyParser.json({ limit: '100mb' })); // enable bodyParser with great Limit
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true })); // encoded bodyParser with great Limit
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors();

  // Session initialise

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  //Config Documentation

  const config = new DocumentBuilder()
    .setTitle('LIFE RADIO BACKEND DOCUMENTATION')
    .setDescription(
      'Toute la documentation du projet backend est généré automatiquement, il suffit de consulter la route /documentation',
    )
    .setVersion('1.0')
    
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.init();

  http
    .createServer(server)
    .listen(process.env.APP_PORT, () =>
      logger.verbose(
        `run server on ${process.env.APP_HOST}:${process.env.APP_PORT}`,
      ),
    );
}
bootstrap();
