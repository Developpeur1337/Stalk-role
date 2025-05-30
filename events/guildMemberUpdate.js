const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(client, oldMember, newMember) {
        const logsChannel = await newMember.guild.channels.fetch(client.config.logs).catch(console.error);
        if (!logsChannel) return console.error('Salon des logs introuvable !');

        const rolesAlerte = client.config.alerte || []; 
        const nouveauxRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        const roleAlerte = nouveauxRoles.find(role => rolesAlerte.includes(role.id));
        if (!roleAlerte) return;

        const auditLogs = await newMember.guild.fetchAuditLogs({ limit: 1, type: 25 }).catch(console.error);
        const executant = auditLogs.entries.first()?.executor ?? 'Inconnu';

        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('\`👤\`・Ajout d\`un rôle surveillé')
            .addFields(
                { name: '\`👤\`・Membre concerné', value: `<@${newMember.id}> | \`${newMember.id}\`` },
                { name: '\`👮\`・Ajouté par', value: `<@${executant.id}> | \`${executant.id}\`` },
                { name: '\`🎭\`・Rôle ajouté', value: `<@&${roleAlerte.id}> | \`${roleAlerte.id}\`` },
                { name: '\`🕒\`・Heure', value: `<t:${Math.floor(Date.now() / 1000)}:F>` }
            );

        logsChannel.send({ embeds: [embed] }).catch(console.error);
    }
};
