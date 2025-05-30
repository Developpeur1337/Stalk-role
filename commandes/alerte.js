const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const config = require("../config.json");

module.exports = {
    name: "alerte",
    description: "Ajoute un rôle à surveiller ou affiche la liste.",
    aliases: [],
    permissions: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    botOwner: true,
    async executeSlash(client, interaction) {
        const role = interaction.options.getRole("role");

        if (!role) {
            const rolesList = config.alerte?.length
                ? config.alerte.map((id, index) => `\`${index + 1}\` - <@&${id}> | \`${id}\``).join("\n")
                : "Aucun rôle surveillé.";

            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("\`👁️\`・Rôles surveillés")
                    .setDescription(rolesList)
                    .setColor(0x2F3136)
                ],
                ephemeral: true
            });
        }

        if (!config.alerte.includes(role.id)) {
            config.alerte.push(role.id);
            fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
        }

        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setDescription(`<:990yyes:1371830093252399196>・Le rôle ${role} | \`${role.id}\` est désormais surveillé.`)
                .setColor(0x2F3136)
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
                    .setDescription("Le rôle à surveiller")
                    .setRequired(false)
            );
    }
};
