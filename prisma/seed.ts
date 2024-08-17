import { Prisma, PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { parse } from 'csv-parse';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const prisma = new PrismaClient();

const seedUsers = async () => {
  const filePath = 'prisma/seed/user.csv';
  const data: Array<Prisma.UserCreateInput> = [];

  console.log('📖 Reading user CSV file');

  fs.createReadStream(filePath)
    .pipe(parse({ delimiter: ';', from_line: 2 }))
    .on('data', async (row) => {
      const user: Prisma.UserCreateInput = {
        username: row[0] as string,
        email: row[1] as string,
        firstName: row[2] as string,
        lastName: row[3] as string,
        password: row[4] as string,
        balance: parseInt(row[5]) as number,
        role: row[6] as 'USER' | 'ADMIN',
      };
      data.push(user);
    })
    .on('end', async () => {
      console.log('📖 Finished reading user CSV file');
      console.log('💾 Started inserting users into database...');
      try {
        await prisma.user.createMany({
          data,
          skipDuplicates: true,
        });
        console.log('✅ Finished inserting users!');
      } catch (err) {
        console.log('❌ Something went wrong while inserting users!');
        console.log(err);
      }
    })
    .on('error', (err) => {
      console.log('❌ Something went wrong while inserting users!');
      console.log(err);
    });
};

const seedFilm = async () => {
  const filePath = 'prisma/seed/film.csv';
  const data: Array<Prisma.FilmCreateInput> = [];

  console.log('📖 Reading film CSV file');

  fs.createReadStream(filePath)
    .pipe(parse({ delimiter: ';', from_line: 2 }))
    .on('data', async (row) => {
      const film: Prisma.FilmCreateInput = {
        title: row[0] as string,
        description: row[1] as string,
        director: row[2] as string,
        release_year: parseInt(row[3]) as number,
        genre: (row[4] as string).split('-'),
        price: parseInt(row[5]) as number,
        duration: parseInt(row[6]) as number,
        video_url: row[7] as string,
        cover_image_url: row[8] != '' ? row[8] : null,
      };
      data.push(film);
    })
    .on('end', async () => {
      console.log('📖 Finished reading film CSV file');
      console.log('💾 Started inserting films into database...');
      try {
        await prisma.film.createMany({
          data,
          skipDuplicates: true,
        });
        console.log('✅ Finished inserting films!');
      } catch (err) {
        console.log('❌ Something went wrong while inserting films!');
        console.log(err);
      }
    })
    .on('error', (err) => {
      console.log('❌ Something went wrong while inserting films!');
      console.log(err);
    });
};

async function runAllSeeds() {
  try {
    await seedUsers();
    await seedFilm();
  } catch (error) {
    console.log(error);
  }
}

if (require.main === module) {
  void runAllSeeds();
}
