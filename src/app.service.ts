import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '¡Bienvenido a UniTrack! Portal estudiantil universitario.';
  }

  getHealth(): object {
    return {
      status: 'OK',
      message: 'UniTrack Backend está funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
