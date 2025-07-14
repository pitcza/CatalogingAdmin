import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { appSettings } from '../../environments/environment';

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

  decryptPayload(encrypted: string): any {
    const hexPayload = atob(encrypted);

    const prefixLength = 12;
    const ivHex = hexPayload.slice(prefixLength, prefixLength + 32);
    const keyHex = hexPayload.slice(prefixLength + 32, prefixLength + 96);
    const cipherTextHex = hexPayload.slice(prefixLength + 96);

    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const key = CryptoJS.enc.Hex.parse(keyHex);

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(cipherTextHex),
    });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedStr);
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

  public get savedAuth() {
    return this.decryptPayload(sessionStorage.getItem('xs') || '');
  }

  // public set savedAuth(auth: any) {
  //   this.user.authToken = auth.authToken || '';
  //   this.user.name = auth.name || '';
  //   this.user.role = auth.role || '';
  // }

  public clearSavedAuth() {
    // this.user = {
    //   authToken: '',
    //   name: '',
    //   role: '',
    // };
  }
}
