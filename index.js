const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '!setup-tickets' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const embed = new EmbedBuilder()
            .setTitle('🐍 نظام تذاكر عائلة VIPERS')
            .setDescription('مرحباً بك في نظام تذاكر عائلة **VIPERS**.\nرجاءً قم باختيار نوع التذكرة المناسب لطلبك من الأزرار في الأسفل:')
            .setColor('#1E90FF')
            .setFooter({ text: 'VIPERS Family System • جميع الحقوق محفوظة' });

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_apply').setLabel('تقديم علي العائلة').setStyle(ButtonStyle.Success).setEmoji('🎫'),
            new ButtonBuilder().setCustomId('btn_alliance').setLabel('التحالف مع العائلة').setStyle(ButtonStyle.Primary).setEmoji('🤝'),
            new ButtonBuilder().setCustomId('btn_support').setLabel('الدعم الفني').setStyle(ButtonStyle.Secondary).setEmoji('🛠️')
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('btn_player_complaint').setLabel('شكوى علي لاعب').setStyle(ButtonStyle.Danger).setEmoji('⚠️'),
            new ButtonBuilder().setCustomId('btn_staff_complaint').setLabel('شكوى علي إداري').setStyle(ButtonStyle.Danger).setEmoji('🛡️')
        );

        await message.channel.send({ embeds: [embed], components: [row1, row2] });
        message.delete().catch(() => {});
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        const { customId } = interaction;

        if (customId === 'btn_apply') {
            const modal = new ModalBuilder().setCustomId('modal_apply').setTitle('التقديم علي عائلة VIPERS');
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_name').setLabel('اسمك').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_age').setLabel('سنك').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_level').setLabel('لفلك (ضع رابط الصورة داخل التكت)').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_id').setLabel('الآيدي (ID) الخاص بك').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_deposit').setLabel('هل توافق علي دفع 500 الف كتامين؟').setStyle(TextInputStyle.Short).setPlaceholder('نعم / لا').setRequired(true))
            );
            return interaction.showModal(modal);
        }

        if (customId === 'btn_alliance') {
            const modal = new ModalBuilder().setCustomId('modal_alliance').setTitle('طلب تحالف مع VIPERS');
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_fam_name').setLabel('اسم عائلتك').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_fam_rank').setLabel('رتبتك في العائلة الخاصة بيك').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_fam_reason').setLabel('لماذا تريد التحالف مع عائلتنا؟').setStyle(TextInputStyle.Paragraph).setRequired(true))
            );
            return interaction.showModal(modal);
        }

        if (customId === 'btn_support') {
            const modal = new ModalBuilder().setCustomId('modal_support').setTitle('تذكرة الدعم الفني');
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_supp_name').setLabel('اسمك').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_supp_issue').setLabel('شرح مبسط لمشكلتك').setStyle(TextInputStyle.Paragraph).setRequired(true))
            );
            return interaction.showModal(modal);
        }

        if (customId === 'btn_player_complaint') {
            const modal = new ModalBuilder().setCustomId('modal_player').setTitle('تقديم شكوى علي لاعب');
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_p_name').setLabel('اسمك').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_p_target').setLabel('اسم اللاعب اللي هتشتكي عليه').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_p_reason').setLabel('سبب الشكوى بالتفصيل').setStyle(TextInputStyle.Paragraph).setRequired(true))
            );
            return interaction.showModal(modal);
        }

        if (customId === 'btn_staff_complaint') {
            const modal = new ModalBuilder().setCustomId('modal_staff').setTitle('تقديم شكوى علي إداري');
            modal.addComponents(
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_s_name').setLabel('اسمك').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_s_target').setLabel('اسم الإداري اللي هتشتكي عليه').setStyle(TextInputStyle.Short).setRequired(true)),
                new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('q_s_reason').setLabel('سبب الشكوى بالتفصيل').setStyle(TextInputStyle.Paragraph).setRequired(true))
            );
            return interaction.showModal(modal);
        }

        if (customId === 'close_ticket') {
            await interaction.reply({ content: 'سيتم إغلاق التذكرة خلال 5 ثوانٍ...', ephemeral: true });
            setTimeout(() => {
                interaction.channel.delete().catch(() => {});
            }, 5000);
        }
    }

    if (interaction.isModalSubmit()) {
        const guild = interaction.guild;
        const user = interaction.user;

        let title = '';
        let fields = [];

        if (interaction.customId === 'modal_apply') {
            title = '🎫 طلب تقديم علي العائلة';
            fields = [
                { name: 'الاسم:', value: interaction.fields.getTextInputValue('q_name') },
                { name: 'السن:', value: interaction.fields.getTextInputValue('q_age') },
                { name: 'اللفل:', value: interaction.fields.getTextInputValue('q_level') },
                { name: 'الآيدي (ID):', value: interaction.fields.getTextInputValue('q_id') },
                { name: 'موافقة التأمين (500k):', value: interaction.fields.getTextInputValue('q_deposit') }
            ];
        } else if (interaction.customId === 'modal_alliance') {
            title = '🤝 طلب تحالف عائلات';
            fields = [
                { name: 'اسم العائلة:', value: interaction.fields.getTextInputValue('q_fam_name') },
                { name: 'الرتبة:', value: interaction.fields.getTextInputValue('q_fam_rank') },
                { name: 'سبب التحالف:', value: interaction.fields.getTextInputValue('q_fam_reason') }
            ];
        } else if (interaction.customId === 'modal_support') {
            title = '🛠️ تذكرة دعم فني';
            fields = [
                { name: 'الاسم:', value: interaction.fields.getTextInputValue('q_supp_name') },
                { name: 'شرح المشكلة:', value: interaction.fields.getTextInputValue('q_supp_issue') }
            ];
        } else if (interaction.customId === 'modal_player') {
            title = '⚠️ شكوى علي لاعب';
            fields = [
                { name: 'الاسم:', value: interaction.fields.getTextInputValue('q_p_name') },
                { name: 'المشتكى عليه:', value: interaction.fields.getTextInputValue('q_p_target') },
                { name: 'سبب الشكوى:', value: interaction.fields.getTextInputValue('q_p_reason') }
            ];
        } else if (interaction.customId === 'modal_staff') {
            title = '🛡️ شكوى علي إداري';
            fields = [
                { name: 'الاسم:', value: interaction.fields.getTextInputValue('q_s_name') },
                { name: 'الإداري المشتكى عليه:', value: interaction.fields.getTextInputValue('q_s_target') },
                { name: 'سبب الشكوى:', value: interaction.fields.getTextInputValue('q_s_reason') }
            ];
        }

        const channelName = `ticket-${user.username}`.toLowerCase().replace(/[^a-z0-9]/g, '');
        const ticketChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles] }
            ]
        });

        const ticketEmbed = new EmbedBuilder()
            .setTitle(title)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .addFields(fields)
            .setColor('#2F3136')
            .setTimestamp();

        const closeBtn = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('close_ticket').setLabel('إغلاق التذكرة 🔒').setStyle(ButtonStyle.Danger)
        );

        await ticketChannel.send({ content: `${user} | مرحباً بك، سيتم الرد عليك قريباً من الإدارة.`, embeds: [ticketEmbed], components: [closeBtn] });
        await interaction.reply({ content: `تم فتح تذكرتك بنجاح: ${ticketChannel}`, ephemeral: true });
    }
});

client.login(process.env.TOKEN);
          
