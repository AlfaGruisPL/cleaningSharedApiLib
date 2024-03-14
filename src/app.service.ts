import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import axios from 'axios';

@Injectable()
export class AppService {
  /*  getHello(): {} {
      // return { message: 'Hello World!' };
    }
      property: `properties/G-DTLBLJ4GZL`,
  */
  // analyticsDataClient = new BetaAnalyticsDataClient();
  private readonly viewId: string = '428646224 '; // Zastąp własnym identyfikatorem widoku w Google Analytics

  async getHello() {
    const { JWT } = require('google-auth-library');

    // const keys = require('./jwt.keys.json');

    /*   const client = new JWT({
         email: process.env.CLIENT_EMAIL,
         key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
         scopes: ['https://www.googleapis.com/auth/cloud-platform'],
       });
       const url = `https://dns.googleapis.com/dns/v1/projects/praca-415614`;
       const res = await client.request({ url });
       console.log(res.data);
     }

     main().catch(console.error);
 */
    const jwtClient = new google.auth.JWT(
      process.env.CLIENT_EMAIL,
      null,
      process.env.PRIVATE_KEY,
      'https://www.googleapis.com/auth/analytics.readonly',
    );
    console.log(
      jwtClient,
      process.env.CLIENT_EMAIL.length,
      process.env.PRIVATE_KEY.length,
    );

    try {
      const response = await jwtClient.authorize();
      const k = await google.analytics('v3').data.ga.get({
        auth: jwtClient,
        ids: 'ga:' + '428646224',
        'start-date': '30daysAgo',
        'end-date': 'today',
        metrics: 'ga:pageviews',
      });
      console.log(1231);
      console.log(k);

      const result = await axios.post(
        `https://analyticsreporting.googleapis.com/v4/reports:batchGet`,
        {
          reportRequests: [
            {
              viewId: this.viewId,
              dateRanges: [
                {
                  startDate: '7daysAgo',
                  endDate: 'today',
                },
              ],
              metrics: [
                {
                  expression: 'ga:activeUsers',
                },
              ],
            },
          ],
        },
        {
          headers: {
            // @ts-ignore
            Authorization: `Bearer ${response.token}`,
          },
        },
      );

      const activeUsers = result.data.reports[0].data.totals[0].values[0];
      return parseInt(activeUsers, 10);
    } catch (error) {
      console.log(1);
      console.error(error.message);
    }
  }
}
