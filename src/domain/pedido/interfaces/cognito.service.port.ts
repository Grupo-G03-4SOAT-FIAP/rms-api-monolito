export interface ICognitoAuth {
  initiateAuth(userCpf: string): any;
  respondToAuthChallenge(initiateAuthSession: string, userCpf: string): any;
}

export const ICognitoAuth = Symbol('ICognitoAuth');
