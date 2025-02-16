import { PrismaClient, SurveyStatus } from '@prisma/client';
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

async function survey() {
  const data = {
    surveyHeaders: [
      {
        id: 1,
        nama_survey: 'Survey Tiang Listrik Area A',
        lokasi: 'Jakarta Selatan',
        status_survey: SurveyStatus.Belum_Disetujui,
        user_id: 'asasa123',
      },
      {
        id: 2,
        nama_survey: 'Survey Jaringan Area B',
        lokasi: 'Bandung',
        status_survey: SurveyStatus.Belum_Disetujui,
        user_id: 'asasa123',
      },
    ],
    surveyDetails: [
      {
        id_material_tiang: 236,
        id_material_konduktor: 2,
        id_konstruksi: 2,
        id_header: 1,
        nama_pekerjaan: 'Pemasangan Tiang Beton',
        penyulang: 'Feeder A',
        panjang_jaringan: 500,
        long: '106.816666',
        lat: '-6.200000',
        foto: 'tiang1.jpg',
        keterangan: 'Tiang sudah lapuk',
        petugas_survey: 'Budi Santoso',
      },
      {
        id_material_tiang: 237,
        id_material_konduktor: 3,
        id_konstruksi: 3,
        id_header: 1,
        nama_pekerjaan: 'Penarikan Kabel',
        penyulang: 'Feeder A',
        panjang_jaringan: 300,
        long: '106.818888',
        lat: '-6.201111',
        foto: 'kabel1.jpg',
        keterangan: 'Tiang sudah lapuk',
        petugas_survey: 'Dewi Lestari',
      },
      {
        id_material_tiang: 238,
        id_material_konduktor: 2,
        id_konstruksi: 2,
        id_header: 2,
        nama_pekerjaan: 'Perbaikan Konstruksi',
        penyulang: 'Feeder B',
        panjang_jaringan: 450,
        long: '107.616667',
        lat: '-6.900000',
        foto: 'konstruksi1.jpg',
        keterangan: 'Tiang sudah lapuk',
        petugas_survey: 'Ahmad Rijal',
      },
      {
        id_material_tiang: 239,
        id_material_konduktor: 3,
        id_konstruksi: 3,
        id_header: 2,
        nama_pekerjaan: 'Pengecekan Tiang',
        penyulang: 'Feeder B',
        panjang_jaringan: 350,
        long: '107.618888',
        lat: '-6.901111',
        foto: 'tiang2.jpg',
        keterangan: 'Tiang sudah lapuk',
        petugas_survey: 'Siti Aminah',
      },
    ],
  };

  try {
    console.log('Seeding database...');

    // Insert survey headers
    const insertedHeaders = [];
    for (const header of data.surveyHeaders) {
      const newHeader = await prisma.surveyHeader.create({ data: header });
      insertedHeaders.push(newHeader);
    }

    for (let i = 0; i < data.surveyDetails.length; i++) {
      await prisma.surveyDetail.create({
        data: {
          nama_pekerjaan: data.surveyDetails[i].nama_pekerjaan,
          penyulang: data.surveyDetails[i].penyulang,
          panjang_jaringan: data.surveyDetails[i].panjang_jaringan,
          long: data.surveyDetails[i].long,
          lat: data.surveyDetails[i].lat,
          foto: data.surveyDetails[i].foto,
          petugas_survey: data.surveyDetails[i].petugas_survey,
          keterangan: data.surveyDetails[i].keterangan,
          material_tiang: {
            connect: { id: data.surveyDetails[i].id_material_tiang },
          },
          material_konduktor: {
            connect: { id: data.surveyDetails[i].id_material_konduktor },
          },
          konstruksi: { connect: { id: data.surveyDetails[i].id_konstruksi } },
          survey_header: { connect: { id: data.surveyDetails[i].id_header } },
        },
      });
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

const main = async () => {
  // await users();
  await tipe_material();
  await konstruksi();
  await material();
  await material_konstruksi();
  // await survey();
};

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
