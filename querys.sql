CREATE TABLE [dbo].[brands](
	[id_brand] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[logo_url] [nvarchar](255) NULL,
	[contact_phone] [nvarchar](15) NULL,
	[contact_email] [nvarchar](100) NULL,
	[created_at] [datetime2](7) NOT NULL DEFAULT GETDATE(),
	[updated_at] [datetime2](7) NOT NULL DEFAULT GETDATE(),
	[is_active] [bit] NOT NULL
) ON [PRIMARY]
GO
