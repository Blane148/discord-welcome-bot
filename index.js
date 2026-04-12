require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`Бот запущен как ${client.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {
  try {
    // Выдаем роль новому участнику
    const roleId = process.env.WELCOME_ROLE_ID;
    const role = member.guild.roles.cache.get(roleId);
    
    if (role) {
      await member.roles.add(role);
      console.log(`Роль ${role.name} выдана пользователю ${member.user.tag}`);
    } else {
      console.error('Роль не найдена. Проверьте WELCOME_ROLE_ID в .env');
    }

    // Отправляем приветствие в канал
    const channelId = process.env.WELCOME_CHANNEL_ID;
    const channel = member.guild.channels.cache.get(channelId);
    
    if (channel) {
      await channel.send(`Добро пожаловать на сервер, ${member}! 🎉`);
      console.log(`Приветствие отправлено для ${member.user.tag}`);
    } else {
      console.error('Канал не найден. Проверьте WELCOME_CHANNEL_ID в .env');
    }
  } catch (error) {
    console.error('Ошибка при обработке нового участника:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);
