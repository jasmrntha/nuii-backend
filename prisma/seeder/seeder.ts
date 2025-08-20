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
    const dataMaterial = await csv().fromFile(
      __dirname + '/data/material_2.csv',
    );

    let materials = dataMaterial.map(data => ({
      id_tipe_material: parseInt(data.tipe_material),
      nomor_material: parseInt(data.nomer_material),
      nama_material: data.nama_material,
      satuan_material: data.sat,
      berat_material: data.berat
        ? parseFloat(data.berat.replace(',', '.'))
        : null,
      harga_material: data['harga material']
        ? parseFloat(data['harga material'].replace(',', '.'))
        : null,
      pasang_rab: data.pasang_rab
        ? parseFloat(data.pasang_rab.replace(',', '.'))
        : null,
      bongkar: data.bongkar ? parseFloat(data.bongkar.replace(',', '.')) : null,
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
      __dirname + '/data/material_konstruksi_2.csv',
    );

    let konstruksiMaterials = dataKonstruksiMaterial.map(data => ({
      id_material: parseInt(data.nomor_material),
      id_konstruksi: parseInt(data.nomor_konstruksi),
      kuantitas: parseInt(data.kuantitas),
      tipe: parseInt(data.tipe),
    }));

    for (const material of konstruksiMaterials) {
      await prisma.konstruksiMaterial.create({
        data: {
          id_material: material.id_material,
          id_konstruksi: material.id_konstruksi,
          kuantitas: material.kuantitas,
          id_tipe_pekerjaan: material.tipe,
        },
      });
    }

    console.log('Konstruksi Material data inserted successfully!');
  } catch (error) {
    console.error('Error inserting Konstruksi Material data, ', error);
  }
}

// async function survey() {
//   const data = {
//     surveyHeaders: [
//       {
//         id: 1,
//         nama_survey: 'Survey Tiang Listrik Area A',
//         lokasi: 'Jakarta Selatan',
//         status_survey: SurveyStatus.Belum_Disetujui,
//         user_id: 'asasa123',
//       },
//       {
//         id: 2,
//         nama_survey: 'Survey Jaringan Area B',
//         lokasi: 'Bandung',
//         status_survey: SurveyStatus.Belum_Disetujui,
//         user_id: 'asasa123',
//       },
//     ],
//     surveyDetails: [
//       {
//         id_material_tiang: 236,
//         id_material_konduktor: 2,
//         id_konstruksi: 2,
//         id_header: 1,
//         nama_pekerjaan: 'Pemasangan Tiang Beton',
//         penyulang: 'Feeder A',
//         panjang_jaringan: 500,
//         long: '106.816666',
//         lat: '-6.200000',
//         foto: 'tiang1.jpg',
//         keterangan: 'Tiang sudah lapuk',
//         petugas_survey: 'Budi Santoso',
//       },
//       {
//         id_material_tiang: 237,
//         id_material_konduktor: 3,
//         id_konstruksi: 3,
//         id_header: 1,
//         nama_pekerjaan: 'Penarikan Kabel',
//         penyulang: 'Feeder A',
//         panjang_jaringan: 300,
//         long: '106.818888',
//         lat: '-6.201111',
//         foto: 'kabel1.jpg',
//         keterangan: 'Tiang sudah lapuk',
//         petugas_survey: 'Dewi Lestari',
//       },
//       {
//         id_material_tiang: 238,
//         id_material_konduktor: 2,
//         id_konstruksi: 2,
//         id_header: 2,
//         kategori: 'Perbaikan Konstruksi',
//         penyulang: 'Feeder B',
//         panjang_jaringan: 450,
//         long: '107.616667',
//         lat: '-6.900000',
//         foto: 'konstruksi1.jpg',
//         keterangan: 'Tiang sudah lapuk',
//         petugas_survey: 'Ahmad Rijal',
//       },
//       {
//         id_material_tiang: 239,
//         id_material_konduktor: 3,
//         id_konstruksi: 3,
//         id_header: 2,
//         nama_pekerjaan: 'Pengecekan Tiang',
//         penyulang: 'Feeder B',
//         panjang_jaringan: 350,
//         long: '107.618888',
//         lat: '-6.901111',
//         foto: 'tiang2.jpg',
//         keterangan: 'Tiang sudah lapuk',
//         petugas_survey: 'Siti Aminah',
//       },
//     ],
//   };

//   try {
//     console.log('Seeding database...');

//     // Insert survey headers
//     const insertedHeaders = [];
//     for (const header of data.surveyHeaders) {
//       const newHeader = await prisma.surveyHeader.create({ data: header });
//       insertedHeaders.push(newHeader);
//     }

//     for (let i = 0; i < data.surveyDetails.length; i++) {
//       await prisma.surveyDetail.create({
//         data: {
//           nama_pekerjaan: data.surveyDetails[i].nama_pekerjaan,
//           penyulang: data.surveyDetails[i].penyulang,
//           panjang_jaringan: data.surveyDetails[i].panjang_jaringan,
//           long: data.surveyDetails[i].long,
//           lat: data.surveyDetails[i].lat,
//           foto: data.surveyDetails[i].foto,
//           petugas_survey: data.surveyDetails[i].petugas_survey,
//           keterangan: data.surveyDetails[i].keterangan,
//           material_tiang: {
//             connect: { id: data.surveyDetails[i].id_material_tiang },
//           },
//           material_konduktor: {
//             connect: { id: data.surveyDetails[i].id_material_konduktor },
//           },
//           konstruksi: { connect: { id: data.surveyDetails[i].id_konstruksi } },
//           survey_header: { connect: { id: data.surveyDetails[i].id_header } },
//         },
//       });
//     }

//     console.log('Database seeded successfully!');
//   } catch (error) {
//     console.error('❌ Seeding failed:', error);
//   }
// }

// async function kategori_material() {
//   try {
//     const dataKategoriMaterial = await csv().fromFile(
//       __dirname + '/data/kategori_material.csv',
//     );

//     let kategoriMaterials = dataKategoriMaterial.map(data => ({
//       id: parseInt(data.nomor),
//       kategori: data.kategori,
//     }));

//     for (const kategori of kategoriMaterials) {
//       await prisma.kategoriMaterial.create({
//         data: {
//           id: kategori.id,
//           kategori: kategori.kategori,
//         },
//       });
//     }

//     console.log('Kategori Material data inserted successfully!');
//   } catch (error) {
//     console.error('Error inserting Kategori Material data, ', error);
//   }
// }

async function tipe_pekerjaan() {
  try {
    const dataTipePekerjaan = await csv().fromFile(
      __dirname + '/data/tipe_pekerjaan.csv',
    );

    let tipePekerjaans = dataTipePekerjaan.map(data => ({
      id: parseInt(data.nomor),
      tipe_pekerjaan: data.tipe,
    }));

    for (const tipe of tipePekerjaans) {
      await prisma.tipePekerjaan.create({
        data: {
          id: tipe.id,
          tipe_pekerjaan: tipe.tipe_pekerjaan,
        },
      });
    }

    console.log('Tipe Pekerjaan data inserted successfully!');
  } catch (error) {
    console.error('Error inserting Tipe Pekerjaan data, ', error);
  }
}

async function grounding() {
  try {
    const dataGrounding = await csv().fromFile(
      __dirname + '/data/grounding.csv',
    );

    let groundings = dataGrounding.map(data => ({
      id: parseInt(data.id),
      nama_grounding: data.nama_grounding,
    }));

    for (const grounding of groundings) {
      await prisma.groundingTermination.create({
        data: {
          id: grounding.id,
          nama_grounding: grounding.nama_grounding,
        },
      });
    }

    console.log('Grounding data inserted successfully!');
  } catch (error) {
    console.error('Error inserting grounding data, ', error);
  }
}

async function pole() {
  try {
    const dataPole = await csv().fromFile(__dirname + '/data/pole.csv');

    let poles = dataPole.map(data => ({
      id: parseInt(data.id),
      nama_pole: data.nama_pole,
    }));

    for (const pole of poles) {
      await prisma.poleSupporter.create({
        data: {
          id: pole.id,
          nama_pole: pole.nama_pole,
        },
      });
    }

    console.log('Pole data inserted successfully!');
  } catch (error) {
    console.error('Error inserting pole data, ', error);
  }
}

async function grounding_mat() {
  try {
    const dataGroundingMat = await csv().fromFile(
      __dirname + '/data/grounding_material.csv',
    );

    let groundingMats = dataGroundingMat.map(data => ({
      id_grounding: parseInt(data.id_grounding),
      id_material: parseInt(data.id_material),
      tipe: parseInt(data.tipe),
      kuantitas: data.kuantitas,
      tipe_survey: data.tipe_survey,
    }));

    for (const groundingMat of groundingMats) {
      await prisma.groundingMaterial.create({
        data: {
          id_grounding_termination: groundingMat.id_grounding,
          id_material: groundingMat.id_material,
          id_tipe_pekerjaan: groundingMat.tipe,
          kuantitas: groundingMat.kuantitas,
          tipe_survey: groundingMat.tipe_survey,
        },
      });
    }

    console.log('Grounding Material data inserted successfully!');
  } catch (error) {
    console.error('Error inserting grounding material data, ', error);
  }
}

async function pole_mat() {
  try {
    const dataPoleMat = await csv().fromFile(
      __dirname + '/data/pole_material.csv',
    );

    let poleMats = dataPoleMat.map(data => ({
      id_pole: parseInt(data.id_pole),
      id_material: parseInt(data.id_material),
      tipe: parseInt(data.tipe),
      kuantitas: data.kuantitas,
    }));

    for (const poleMat of poleMats) {
      await prisma.poleMaterial.create({
        data: {
          id_pole_supporter: poleMat.id_pole,
          id_material: poleMat.id_material,
          id_tipe_pekerjaan: poleMat.tipe,
          kuantitas: poleMat.kuantitas,
        },
      });
    }

    console.log('Pole Material data inserted successfully!');
  } catch (error) {
    console.error('Error inserting pole material data, ', error);
  }
}

async function jointing_mat() {
  try {
    const dataJointingMat = await csv().fromFile(
      __dirname + '/data/jointing_material.csv',
    );

    let jointingMats = dataJointingMat.map(data => ({
      nomor_material: parseInt(data.nomor_material),
      nama_material: data.nama_material,
      kuantitas: data.kuantitas,
      tipe_survey: data.tipe_survey,
    }));

    for (const jointingMat of jointingMats) {
      await prisma.jointingMaterial.create({
        data: {
          id_material: jointingMat.nomor_material,
          nama_material: jointingMat.nama_material,
          kuantitas: jointingMat.kuantitas,
          tipe_survey: jointingMat.tipe_survey,
        },
      });
    }

    console.log('Jointing Material data inserted successfully!');
  } catch (error) {
    console.error('Error inserting jointing material data, ', error);
  }
}

async function kabel_mat() {
  try {
    const dataKabelMat = await csv().fromFile(
      __dirname + '/data/kabel_material.csv',
    );

    let kabelMats = dataKabelMat.map(data => ({
      nomor_material: parseInt(data.nomor_material),
      nama_material: data.nama_material,
      kuantitas: data.kuantitas,
      tipe_survey: data.tipe_survey,
    }));

    for (const kabelMat of kabelMats) {
      await prisma.kabelMaterial.create({
        data: {
          id_material: kabelMat.nomor_material,
          nama_material: kabelMat.nama_material,
          kuantitas: kabelMat.kuantitas,
          tipe_survey: kabelMat.tipe_survey,
        },
      });
    }

    console.log('Kabel Material data inserted successfully!');
  } catch (error) {
    console.error('Error inserting kabel material data, ', error);
  }
}

async function accessory_mat() {
  try {
    const dataAccessoryMat = await csv().fromFile(
      __dirname + '/data/accessory_material.csv',
    );

    let accessoryMats = dataAccessoryMat.map(data => ({
      nomor_material: parseInt(data.nomor_material),
      nama_material: data.nama_material,
      kuantitas: data.kuantitas,
      tipe_survey: data.tipe_survey,
    }));

    for (const accessoryMat of accessoryMats) {
      await prisma.accessoryMaterial.create({
        data: {
          id_material: accessoryMat.nomor_material,
          nama_material: accessoryMat.nama_material,
          kuantitas: accessoryMat.kuantitas,
          tipe_survey: accessoryMat.tipe_survey,
        },
      });
    }

    console.log('Accessory Material data inserted successfully!');
  } catch (error) {
    console.error('Error inserting accessory material data, ', error);
  }
}

async function terminasi_mat() {
  try {
    const dataTerminasiMat = await csv().fromFile(
      __dirname + '/data/terminasi_material.csv',
    );

    let terminasiMats = dataTerminasiMat.map(data => ({
      nomor_material: parseInt(data.nomor_material),
      nama_material: data.nama_material,
      kuantitas: data.kuantitas,
      tipe_survey: data.tipe_survey,
    }));

    for (const terminasiMat of terminasiMats) {
      await prisma.terminasiMaterial.create({
        data: {
          id_material: terminasiMat.nomor_material,
          nama_material: terminasiMat.nama_material,
          kuantitas: terminasiMat.kuantitas,
          tipe_survey: terminasiMat.tipe_survey,
        },
      });
    }

    console.log('Terminasi Material data inserted successfully!');
  } catch (error) {
    console.error('Error inserting terminasi material data, ', error);
  }
}

const main = async () => {
  // // await users();
  // await tipe_material();
  // // await kategori_material();
  // await tipe_pekerjaan();
  // await konstruksi();
  // await material();
  // await material_konstruksi();
  // // await survey();
  // await grounding();
  // await pole();
  // await grounding_mat();
  // await pole_mat();
  // await jointing_mat();
  // await kabel_mat();
  // await accessory_mat();
  await terminasi_mat();
};

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
