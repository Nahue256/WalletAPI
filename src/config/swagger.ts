import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wallet API',
      version: '1.0.0',
      description: 'A simple wallet management API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Enter your bearer token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The auto-generated UUID of the user',
              readOnly: true
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The email of the user'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'The hashed password of the user',
              writeOnly: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp of when the user was created',
              readOnly: true
            }
          }
        },
        UserCreate: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'The email of the user'
            },
            password: {
              type: 'string',
              description: 'The password of the user'
            }
          }
        },
        UserUpdate: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'The email of the user'
            },
            password: {
              type: 'string',
              description: 'The password of the user'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string'
            }
          }
        },
        Wallet: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The auto-generated UUID of the wallet',
              readOnly: true
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'The ID of the user who owns this wallet',
              readOnly: true
            },
            tag: {
              type: 'string',
              description: 'Optional label for the wallet'
            },
            chain: {
              type: 'string',
              description: 'The blockchain identifier (e.g., Ethereum, Bitcoin)'
            },
            address: {
              type: 'string',
              description: 'The wallet address'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp of when the wallet was created',
              readOnly: true
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The timestamp of when the wallet was last updated',
              readOnly: true
            }
          }
        }
      },
      security: [
        {
          BearerAuth: []
        }
      ]
    }
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec; 