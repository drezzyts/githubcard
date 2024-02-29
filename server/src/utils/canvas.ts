import { GithubUser } from './github';
import * as Canvas from '@napi-rs/canvas';
import { abbreviate } from 'util-stunks';

export default async function generateCard(user: GithubUser, bannerURL: string, stars: number) {
    
  Canvas.GlobalFonts.registerFromPath('src/assets/Inter-ExtraBold.ttf', 'Inter ExtraBold');
  Canvas.GlobalFonts.registerFromPath('src/assets/Inter-Regular.ttf', 'Inter Regular');


  const canvas = Canvas.createCanvas(400, 140);
  const ctx = canvas.getContext('2d');

  const layout = await Canvas.loadImage('https://cdn.discordapp.com/attachments/1040379416741683382/1212838051030765668/base_1.png?ex=65f34a74&is=65e0d574&hm=88381eb8133097c2c87e85ffcb6babeeba6b42976fe357cfcbce7702756dd468&');
  const avatar = await Canvas.loadImage(user.avatar_url);
  const banner = await Canvas.loadImage(bannerURL);

  ctx.drawImage(banner, 0, 0, 400, 82);
  ctx.drawImage(layout, 0, 0, layout.width, layout.height);

  ctx.font = '10px Inter ExtraBold';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(user.name, 125, 92.5);

  ctx.font = '8px Inter Regular';
  ctx.fillText(abbreviate(stars), 150, 118.5);

  ctx.font = '8px Inter Regular';
  ctx.fillText(abbreviate(user.followers), 238.5, 118.5);
  
  ctx.font = '8px Inter Regular';
  ctx.fillText(abbreviate(user.public_repos), 340, 118.5);
  
  const radius = 40;
  const x = 13 + radius; 
  const y = 42 + radius;   

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(avatar, 13, 42, 2 * radius, 2 * radius);

  
  return canvas.toBuffer('image/png');
}
