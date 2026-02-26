import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Barbearia dos Reis API',
            version: '1.0.0',
            description:
                'API RESTful para a gestão da Barbearia dos Reis. Gerencia usuários (Barbeiros e Funcionários) e o catálogo de cortes de cabelo.',
        },
        servers: [
            {
                url: 'http://localhost:3333/api',
                description: 'Servidor de Desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string', example: 'João Silva' },
                        email: { type: 'string', format: 'email', example: 'joao@barbearia.com' },
                        role: { type: 'string', enum: ['BARBER', 'EMPLOYEE'] },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Haircut: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string', example: 'Degradê com Barba' },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['fade', 'barba', 'social'],
                        },
                        duration: { type: 'integer', example: 45, description: 'Duração em minutos' },
                        description: { type: 'string', example: 'Corte moderno com degradê nas laterais.' },
                        modelUrl: {
                            type: 'string',
                            format: 'uri',
                            nullable: true,
                            example: 'https://seu-projeto.supabase.co/storage/v1/object/public/models/photo.jpg',
                        },
                        createdById: { type: 'string', format: 'uuid' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Mensagem de erro' },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/docs/*.yaml'],
};

export const swaggerSpec = swaggerJSDoc(options);
