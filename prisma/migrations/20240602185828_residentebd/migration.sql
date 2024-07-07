BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Residente] (
    [idResidente] INT NOT NULL IDENTITY(1,1),
    [nomeCompleto] NVARCHAR(1000) NOT NULL,
    [dataNascimento] DATETIME2 NOT NULL,
    [documentoIdentificacao] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Residente_pkey] PRIMARY KEY CLUSTERED ([idResidente])
);

-- CreateTable
CREATE TABLE [dbo].[Profissional] (
    [idProfissional] INT NOT NULL IDENTITY(1,1),
    [nome] NVARCHAR(1000) NOT NULL,
    [cpf] NVARCHAR(1000) NOT NULL,
    [funcao] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [senha] NVARCHAR(1000) NOT NULL,
    [nivelAcesso] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Profissional_pkey] PRIMARY KEY CLUSTERED ([idProfissional]),
    CONSTRAINT [Profissional_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Consulta] (
    [idConsulta] INT NOT NULL IDENTITY(1,1),
    [dataHora] DATETIME2 NOT NULL,
    [tipoConsulta] NVARCHAR(1000) NOT NULL,
    [nomeMedico] NVARCHAR(1000) NOT NULL,
    [compareceu] NVARCHAR(1000) NOT NULL,
    [observacao] NVARCHAR(1000) NOT NULL,
    [residenteId] INT NOT NULL,
    [profissionalId] INT NOT NULL,
    CONSTRAINT [Consulta_pkey] PRIMARY KEY CLUSTERED ([idConsulta])
);

-- CreateTable
CREATE TABLE [dbo].[Medicamento] (
    [idMedicamento] INT NOT NULL IDENTITY(1,1),
    [nomeMedicamento] NVARCHAR(1000) NOT NULL,
    [dosagem] NVARCHAR(1000) NOT NULL,
    [preco] FLOAT(53),
    CONSTRAINT [Medicamento_pkey] PRIMARY KEY CLUSTERED ([idMedicamento])
);

-- CreateTable
CREATE TABLE [dbo].[MedicacaoPaciente] (
    [idMedicacaoPaciente] INT NOT NULL IDENTITY(1,1),
    [idResidente] INT NOT NULL,
    [idMedicamento] INT NOT NULL,
    [idProfissional] INT NOT NULL,
    [quantidadeTempoHoras] INT NOT NULL,
    [quantidadeTempoDias] INT NOT NULL,
    [viaAdministracao] NVARCHAR(1000) NOT NULL,
    [dataHoraMinistrado] DATETIME2 NOT NULL,
    [dataMedicamentoInicio] DATETIME2 NOT NULL,
    [observacao] NVARCHAR(1000),
    CONSTRAINT [MedicacaoPaciente_pkey] PRIMARY KEY CLUSTERED ([idMedicacaoPaciente])
);

-- AddForeignKey
ALTER TABLE [dbo].[Consulta] ADD CONSTRAINT [Consulta_residenteId_fkey] FOREIGN KEY ([residenteId]) REFERENCES [dbo].[Residente]([idResidente]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Consulta] ADD CONSTRAINT [Consulta_profissionalId_fkey] FOREIGN KEY ([profissionalId]) REFERENCES [dbo].[Profissional]([idProfissional]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MedicacaoPaciente] ADD CONSTRAINT [MedicacaoPaciente_idResidente_fkey] FOREIGN KEY ([idResidente]) REFERENCES [dbo].[Residente]([idResidente]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MedicacaoPaciente] ADD CONSTRAINT [MedicacaoPaciente_idMedicamento_fkey] FOREIGN KEY ([idMedicamento]) REFERENCES [dbo].[Medicamento]([idMedicamento]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MedicacaoPaciente] ADD CONSTRAINT [MedicacaoPaciente_idProfissional_fkey] FOREIGN KEY ([idProfissional]) REFERENCES [dbo].[Profissional]([idProfissional]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
