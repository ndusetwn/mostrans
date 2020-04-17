import AesCrypto from 'react-native-aes-kit';

const secretKey = '(1xkfh*2.zl^23-]';
const iv = "43i9{tdk'14045xw";

export const encrypt = (data) => new Promise((resolve)=>{
    AesCrypto.encrypt(data,secretKey, iv).then(cipher=>{
        resolve(cipher)
    }).catch(err=>{
        resolve(false)
    });
});

export const decrypt = (data) => new Promise((resolve)=>{
    AesCrypto.decrypt(data,secretKey, iv).then(plaintext=>{
        resolve(plaintext)
    }).catch(err=>{
        resolve(false)
    });
});