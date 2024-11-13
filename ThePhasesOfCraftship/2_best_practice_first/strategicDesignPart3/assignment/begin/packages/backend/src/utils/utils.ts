import { User } from '@prisma/client';


function isMissingKeys (data: any, keysToCheckFor: string[]) {
    for (let key of keysToCheckFor) {
      if (data[key] === undefined) return true;
    } 
    return false;
  }
  
  function generateRandomPassword(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const passwordArray: string[] = [];
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      passwordArray.push(charset[randomIndex]);
    }
  
    return passwordArray.join('');
  }
  
  function parseUserForResponse (user: User) {
    const returnData = JSON.parse(JSON.stringify(user));
    delete returnData.password;
    return returnData;
  }

  export { 
    isMissingKeys, 
    generateRandomPassword, 
    parseUserForResponse 
};