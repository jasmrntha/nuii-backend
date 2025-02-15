import { PrismaClient } from '@prisma/client';
import csv from 'csvtojson';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

const salt = bcryptjs.genSaltSync(12);

async function users() {
  const dataUser = await csv().fromFile(__dirname + '/data/users.csv');
  let users = dataUser.map(user => {
    return {
      email: user.email,
      password: bcryptjs.hashSync(user.password, salt),
      role: user.role,
      name: user.name,
      is_email_verified: user.is_email_verified == 'true' ? true : false,
    };
  });

  // for (const user of users) {
  //   if (user.role == 'ADMIN') {
  //     await prisma.accounts.upsert({
  //       where: {
  //         email: user.email,
  //       },
  //       update: {
  //         email: user.email,
  //         is_email_verified: user.is_email_verified,
  //         password: user.password,
  //         role: user.role,
  //         name: user.name,
  //       },
  //       create: {
  //         email: user.email,
  //         is_email_verified: user.is_email_verified,
  //         password: user.password,
  //         role: user.role,
  //         name: user.name,
  //       },
  //     });
  //   } else {
  //     await prisma.accounts.upsert({
  //       where: {
  //         email: user.email,
  //       },
  //       update: {
  //         email: user.email,
  //         is_email_verified: user.is_email_verified,
  //         password: user.password,
  //         role: user.role,
  //         name: user.name
  //       },
  //       create: {
  //         email: user.email,
  //         is_email_verified: user.is_email_verified,
  //         password: user.password,
  //         role: user.role,
  //         name: user.name,
  //       },
  //     });
  //   }
  // }
}

async function tipe_material() {
  try {
    const dataTipe = await csv().fromFile(
      __dirname + '/data/tipe_material.csv',
    );

    let kategori = dataTipe.map(data => ({
      tipe_material: data.tipe,
    }));

    for (const type of kategori) {
      await prisma.tipeMaterial.create({
        data: {
          tipe_material: type.tipe_material,
        },
      });
    }

    console.log('Tipe material inserted successfully!');
  } catch (error) {
    console.error('Error inserting tipe material, ', error);
  }
}

async function material() {
  try {
    const dataMaterial = await csv().fromFile(__dirname + '/data/material.csv');

    let materials = dataMaterial.map(data => ({
      id_tipe_material: parseInt(data.tipe_material),
      nomor_material: parseInt(data.nomer_material),
      nama_material: data.nama_material,
      satuan_material: data.sat,
      berat_material: data.berat.replace(',', '.'),
      harga_material: parseFloat(data['harga material'].replace(',', '.')),
      pasang_rab: parseFloat(data.pasang_rab.replace(',', '.')),
      bongkar: parseFloat(data.bongkar.replace(',', '.')),
      jenis_material: data.jenis_material,
      kategori_material: data.kategori_material,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    for (const material of materials) {
      await prisma.material.create({
        data: material,
      });
    }

    console.log('Materials inserted successfully!');
  } catch (error) {
    console.error('Error inserting materials, ', error);
  }
}

async function konstruksi() {
  try {
    const dataKonstruksi = await csv().fromFile(
      __dirname + '/data/konstruksi.csv',
    );

    let konstruksis = dataKonstruksi.map(data => ({
      nomor_konstruksi: parseInt(data.nomor_konstruksi),
      nama_konstruksi: data.nama,
    }));

    for (const konstruksi of konstruksis) {
      await prisma.konstruksi.create({
        data: {
          nomor_konstruksi: konstruksi.nomor_konstruksi,
          nama_konstruksi: konstruksi.nama_konstruksi,
        },
      });
    }

    console.log('Konstruksi data inserted successfully!');
  } catch (error) {
    console.error('Error inserting konstruksi data, ', error);
  }
}

async function material_konstruksi() {
  try {
    const dataKonstruksiMaterial = await csv().fromFile(
      __dirname + '/data/material_konstruksi.csv',
    );

    let konstruksiMaterials = dataKonstruksiMaterial.map(data => ({
      id_material: parseInt(data.nomor_material),
      id_konstruksi: parseInt(data.nomor_konstruksi),
      kategori_material: data.kategori_material,
      kuantitas: parseInt(data.kuantitas),
    }));

    for (const material of konstruksiMaterials) {
      await prisma.konstruksiMaterial.create({
        data: {
          id_material: material.id_material,
          id_konstruksi: material.id_konstruksi,
          kategori_material: material.kategori_material,
          kuantitas: material.kuantitas,
        },
      });
    }

    console.log('Konstruksi Material data inserted successfully!');
  } catch (error) {
    console.error('Error inserting Konstruksi Material data, ', error);
  }
}

const main = async () => {
  // await users();
  await tipe_material();
  await konstruksi();
  await material();
  await material_konstruksi();
};

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
