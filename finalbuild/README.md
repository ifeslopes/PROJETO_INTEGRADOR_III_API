# Passo a Passo Rodando Api

### Passo a Passo

1. **Instalar Docker**
    - **Para Windows e macOS**: Baixe e instale o Docker Desktop a partir do [site oficial do Docker](https://www.docker.com/products/docker-desktop).
    - **Para Linux**: Siga as instruções de instalação específicas para a sua distribuição, disponíveis no [site oficial do Docker](https://docs.docker.com/engine/install/).
    - **Play With Docke**: O Play With Docker oferece a você a experiência de ter uma máquina virtual Alpine Linux gratuita na nuvem [site oficial do Play with docke](https://labs.play-with-docker.com/).
2. **Verificar Instalação**
    - Abra o terminal (ou prompt de comando) e execute:
        
        ```
        docker --version
        docker-compose --version
        
        ```
        
    - Você deve ver a versão instalada do Docker e do Docker Compose.
3. **Criar Arquivo `docker-compose.yml`**
    - Crie um diretório para o seu projeto:
        
        ```
        mkdir meu_projeto && cd meu_projeto
        
        ```
        
    - Crie e abra o arquivo `docker-compose.yml` no seu editor de texto preferido:
        
        ```
        touch docker-compose.yml
        
        ```
        
    - Cole o seguinte conteúdo no arquivo `docker-compose.yml`:
        
        ```yaml
        version: "3.9"
        services:
        web:
            image: lopes231/backend-web:v1
            volumes:
            - ./:/app
            command: npm run prisma
            ports:
            - "3005:3005"
            environment:
            NODE_ENV: development
            DEBUG: nodejs-docker
            NODE_OPTIONS: "--max-old-space-size=1200"
            DATABASE_URL: "sqlserver://sqlserver:1433;database=residenteDB;integratedSecurity=true;username=sa;password=Xr09LDtRhyW3LkiI;trustServerCertificate=true;encrypt=true;IntegratedSecurity=false;"
            depends_on:
            sqlserver:
                condition: service_healthy

        sqlserver:
            image: mcr.microsoft.com/mssql/server:2022-latest
            container_name: sql_server_express
            restart: always
            environment:
            SA_PASSWORD: "Xr09LDtRhyW3LkiI"
            ACCEPT_EULA: "Y"
            MSSQL_PID: "Express"
            MSSQL_DB: "residentb"
            ports:
            - "1433:1433"
            volumes:
            - sqlserver_database:/var/opt/mssql

            healthcheck:
            test:
                [
                "CMD-SHELL",
                "/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'Xr09LDtRhyW3LkiI' -Q 'SELECT 1'",
                ]
            interval: 15s
            timeout: 10s
            retries: 10


        volumes:
        sqlserver_database:

        
        ```
        
4. **Executar Docker Compose**
    - No terminal, navegue até o diretório onde você criou o arquivo `docker-compose.yml` e execute:
        
        ```
        docker-compose up
        
        ```