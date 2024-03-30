import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

const clientId = 't0ibbfnf2af8149262dlrkm2h';
const baseUrl = 'https://cognito-idp.us-east-1.amazonaws.com';

export class CognitoAuth {
  async initiateAuth(userCpf = '00000000191') {
    const initiateAuth = await request(baseUrl)
      .post('/')
      .set('X-Amz-Target', 'AWSCognitoIdentityProviderService.InitiateAuth')
      .set('Content-Type', 'application/x-amz-json-1.1')
      .send(
        JSON.stringify({
          AuthFlow: 'CUSTOM_AUTH',
          AuthParameters: {
            USERNAME: userCpf, // CPF do Cliente aqui
          },
          ClientId: clientId, // Informe o Client ID da sua aplicação aqui
        }),
      )
      .expect(HttpStatus.OK)
      .then((response) => {
        return JSON.parse(response.text);
      });

    return initiateAuth;
  }

  async respondToAuthChallenge(
    initiateAuthSession: string,
    userCpf = '00000000191',
  ) {
    const responseToAuth = await request(baseUrl)
      .post('/')
      .set(
        'X-Amz-Target',
        'AWSCognitoIdentityProviderService.RespondToAuthChallenge',
      )
      .set('Content-Type', 'application/x-amz-json-1.1')
      .send(
        JSON.stringify({
          ClientId: 't0ibbfnf2af8149262dlrkm2h',
          ChallengeName: 'CUSTOM_CHALLENGE',
          Session: initiateAuthSession,
          ChallengeResponses: {
            ANSWER: 'answer',
            USERNAME: userCpf,
          },
        }),
      )
      .expect(HttpStatus.OK)
      .then((response) => {
        return JSON.parse(response.text);
      });
    return responseToAuth;
  }
}
