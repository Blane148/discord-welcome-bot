require('dotenv').config();
const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

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

    // Создаем изображение с ником пользователя
    const canvas = createCanvas(800, 450);
    const ctx = canvas.getContext('2d');

    // Загружаем фоновую картинку
    const background = await loadImage('IMG_0974.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Настраиваем текст с тенью для лучшей читаемости
    const displayName = member.displayName;
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Пробуем разные шрифты для кириллицы
    ctx.font = 'bold 60px "DejaVu Sans", "Liberation Sans", "Noto Sans", "Ubuntu", "Roboto", "FreeSans", "Droid Sans", sans-serif';
    
    // Рисуем тень
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillText(displayName, canvas.width / 2 + 3, canvas.height / 2 + 3);
    
    // Рисуем основной текст
    ctx.fillStyle = '#ffffff';
    ctx.fillText(displayName, canvas.width / 2, canvas.height / 2);

    // Конвертируем canvas в attachment
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome.png' });

    // Отправляем приветствие в канал
    const channelId = process.env.WELCOME_CHANNEL_ID;
    const channel = member.guild.channels.cache.get(channelId);
    
    if (channel) {
      await channel.send({
        content: `Добро пожаловать на сервер, ${member}! 🎉`,
        files: [attachment]
      });
      console.log(`Приветствие отправлено для ${member.user.tag}`);
    } else {
      console.error('Канал не найден. Проверьте WELCOME_CHANNEL_ID в .env');
    }
  } catch (error) {
    console.error('Ошибка при обработке нового участника:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);
