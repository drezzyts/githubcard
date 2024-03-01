import fastify from 'fastify';
import { getGithubUser, getGithubUserTotalStars } from '../utils/github';
import generateCard from '../utils/canvas';

import fastifyStatic from "@fastify/static";
import path from 'path';

const app = fastify();

app.register(fastifyStatic, {
  root: path.resolve('client'),
  prefix: '/'
});

interface CardQuery {
    username?: string,
    banner?: string
}

app.get('/', async (request, response) => {
  response.redirect('/index.html')
});

app.get('/card', async (request, response) => {
  const { username, banner } = request.query as CardQuery;

  if(!username || !banner) return response.status(422).send({
    error: true,
    message: 'Missing required parameters: ' + username ? 'banner' : 'username'
  });

  const user = await getGithubUser(username);
  const stars = await getGithubUserTotalStars(username);

  if(!user || !stars) return response.status(422).send({
    error: true,
    message: 'Invalid github username'
  });

  const card = await generateCard(user, banner, stars);

  return response.status(200).type('image/png').send(card);
})

app.listen({ 
  port: Number(process.env.PORT) || 3000,
  host: '0.0.0.0' 
}, () => {
  console.log('HTTP server is running!');
});