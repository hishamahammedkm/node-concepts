import { Injectable, Logger } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { workerThreadFilePath } from './worker/config';
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly logger = new Logger();

  getHello() {
    return { message: 'Non Blocking call ' };
  }

  blocking() {
    const now = new Date().getTime();
    while (new Date().getTime() < now + 10000) {}
    return { message: ' Blocking call ' };
  }
  async apiBlocking() {
    try {
      const res = await axios.get(
        'https://nodejs-concepts-7kop5zjyeq-el.a.run.app/blocking',
      );
      return res.data;
    } catch (error) {
      throw new Error('api failed');
    }
  }

  // async nonBlocking() {
  //   return new Promise(async (resolve) => {
  //     setTimeout(() => {
  //       resolve({ message: 'Non Blocking call ' });
  //     }, 10000);
  //   });
  // }

  async promises() {
    const results = [];
    for (let i = 0; i < 10; i++) {
      results.push(await this.sleep());
    }
    return results;
  }

  async promisesParallel() {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(this.sleep());
    }
    return Promise.all(promises);
  }

  async worker() {
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerThreadFilePath, {
        workerData: {
          data: 'this is data',
        },
      });
      worker.on('message', (message) => {
        console.log('Main thread got message:', message);
        resolve({ message });
      });
      worker.on('error', (err) => {
        console.error('Worker threw an error:', err);
        reject(err);
      });
      worker.on('exit', (code) => {
        console.log('Worker did exit with code:', code);
      });
    });
  }

  private async sleep() {
    return new Promise((resolve) => {
      this.logger.log('Start sleep');
      setTimeout(() => {
        this.logger.log('Sleep complete');
        resolve({ id: Math.random() });
      }, 1000);
    });
  }
}
