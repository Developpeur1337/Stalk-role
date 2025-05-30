const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const config = require("../config.json");

module.exports = {
    name: "remove",
    description: "Enlève un rôle de la liste des rôles surveillés.",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    botOwner: true,
    async executeSlash(client, interaction) {
        const role = interaction.options.getRole("role");

        if (!role) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription("<:990not:1371830095391756379>・Vous devez spécifier un rôle à retirer.")
                    .setColor(0xFF0000)
                ],
                ephemeral: true
            });
        }

        if (!config.alerte.includes(role.id)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription(`<:990not:1371830095391756379>・Le rôle ${role} | \`${role.id}\` n'est pas surveillé.`)
                    .setColor(0xFF0000)
                ],
                ephemeral: true
            });
        }

        config.alerte = config.alerte.filter(id => id !== role.id);
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));

        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setDescription(`<:990yyes:1371830093252399196>・Le rôle ${role} | \`${role.id}\` a été retiré de la liste des rôles surveillés.`)
                .setColor(0x00FF00)
            ],
            ephemeral: true
        });
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addRoleOption(option => 
                option.setName("role")
                    .setDescription("Le rôle à retirer de la liste des rôles surveillés")
                    .setRequired(true)
            );
    }
};
