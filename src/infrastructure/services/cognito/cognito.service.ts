import axios from 'axios';
import { ICognitoAuth } from 'src/domain/pedido/interfaces/cognito.service.port';

const baseUrl = 'https://cognito-idp.us-east-1.amazonaws.com';

export class CognitoAuth implements ICognitoAuth {
  private _clientId = process.env.COGNITO_CLIENT_ID;
  private anonymous_user = process.env.ANONYMOUS_USER;
  private default_password = process.env.DEFAULT_PASSWORD;

  async initiateAuth(userCpf = this.anonymous_user) {
    const initiateAuthResponse = await axios
      .post(
        baseUrl,
        {
          AuthFlow: 'CUSTOM_AUTH',
          AuthParameters: {
            USERNAME: userCpf,
          },
          ClientId: this._clientId,
        },
        {
          headers: {
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
            'Content-Type': 'application/x-amz-json-1.1',
          },
        },
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error(error);
      });

    return initiateAuthResponse;
  }

  async respondToAuthChallenge(
    initiateAuthSession: string,
    userCpf = this.anonymous_user,
  ) {
    const responseToAuth = await axios
      .post(
        baseUrl,
        {
          ClientId: this._clientId,
          ChallengeName: 'CUSTOM_CHALLENGE',
          Session: initiateAuthSession,
          ChallengeResponses: {
            ANSWER: 'answer',
            USERNAME: userCpf,
          },
        },
        {
          headers: {
            'X-Amz-Target':
              'AWSCognitoIdentityProviderService.RespondToAuthChallenge',
            'Content-Type': 'application/x-amz-json-1.1',
          },
        },
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error(error);
      });

    return responseToAuth;
  }

  async signUp(
    name: string,
    email: string,
    userCpf: string,
    password = this.default_password,
  ) {
    const sigUpResponse = await axios
      .post(
        baseUrl,
        {
          ClientId: this._clientId,
          Username: userCpf,
          Password: password,
          UserAttributes: [
            {
              Name: 'name',
              Value: name,
            },
            {
              Name: 'email',
              Value: email,
            },
          ],
        },
        {
          headers: {
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp',
            'Content-Type': 'application/x-amz-json-1.1',
          },
        },
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error(error);
      });

    return sigUpResponse;
  }
}
