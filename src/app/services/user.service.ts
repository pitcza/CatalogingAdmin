import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { appSettings } from '../../config/app.settings';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  private genRanHex(size: number): string {
    return Array.from({ length: size }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('');
  }

  encryptPayload(data: object): string {
    const stringData = JSON.stringify(data);

    const key = CryptoJS.enc.Hex.parse(this.genRanHex(64));
    const iv = CryptoJS.enc.Hex.parse(this.genRanHex(32));

    const encrypted = CryptoJS.AES.encrypt(stringData, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    const prefix = this.genRanHex(12);

    const payload =
      prefix +
      iv.toString(CryptoJS.enc.Hex) +
      key.toString(CryptoJS.enc.Hex) +
      encrypted.ciphertext.toString(CryptoJS.enc.Hex);

    return btoa(payload);
  }

  recover(data: any) {
    const decodedData = JSON.parse(
      CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8),
    );

    const key = appSettings.note;
    const iv = CryptoJS.enc.Base64.parse(decodedData.iv);
    const salt = CryptoJS.enc.Base64.parse(decodedData.salt);
    const iterations = CryptoJS.enc.Base64.parse(
      decodedData.iterations,
    ).toString(CryptoJS.enc.Utf8);
    const cipherText = decodedData.encryptedValue;

    const hashKey = CryptoJS.PBKDF2(key, salt, {
      hasher: CryptoJS.algo.SHA256,
      keySize: 8,
      iterations: parseInt(iterations),
    });

    const bytes = CryptoJS.AES.decrypt(cipherText, hashKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    data = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(data);
  }
}
