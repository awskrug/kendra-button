// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
  res.json({
    data: {
      search: {
        items: [
          {
            url:
              'https://s3.us-west-2.amazonaws.com/kendra-button/kendra/What is Amazon Kendra_ - Amazon Kendra.htm',
            title: {
              text:
                'What\n                           is Amazon Kendra? - Amazon Kendra',
              highlights: [],
            },
            excerpt: {
              text:
                'What\n                                    is Amazon Kendra?\n                                 \n\n\n                                 \n                                       PDF       \n   Kindle       \n  \n \n                                     \n                                 \n\n                          ',
              highlights: [{ start: 0, end: 300, topAnswer: null }],
            },
          },
          {
            url:
              'https://s3.us-west-2.amazonaws.com/kendra-button/kendra/What is Amazon Kendra_ - Amazon Kendra.htm',
            title: {
              text:
                'What\n                           is Amazon Kendra? - Amazon Kendra',
              highlights: [
                { start: 42, end: 48, topAnswer: null },
                { start: 59, end: 65, topAnswer: null },
              ],
            },
            excerpt: {
              text:
                '...After the trial expires, there are additional charges for scanning and\n                                    syncing documents using the Amazon Kendra data sources.\n                                 \n\n\n                                 \n                                 For a complete list of...',
              highlights: [{ start: 145, end: 151, topAnswer: null }],
            },
          },
        ],
        total: 2,
      },
    },
  });
};
