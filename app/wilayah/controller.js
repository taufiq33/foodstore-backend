const csvtojson = require('csvtojson');
const path = require('path');

const getProvinsi = async (request, response, next) => {
  const db_provinsi = path.resolve(__dirname, 'data/provinces.csv');

  try {
    const data = await csvtojson().fromFile(db_provinsi);
    return response.json(data);
  } catch (error) {
    return response.json({
      error: 1,
      message: 'Gagal mengambil data provinsi'
    })
  }
}

const getKabupaten = async (request, response, next) => {
  const db_kabupaten = path.resolve(__dirname, 'data/regencies.csv');
  const { kode_provinsi } = request.query;

  try {
    const data = await csvtojson().fromFile(db_kabupaten);
    return response.json(data.filter(kabupaten => kabupaten.kode_provinsi === kode_provinsi));
  } catch (error) {
    return response.json({
      error: 1,
      message: 'Gagal mengambil data kabupaten'
    })
  }
}

const getKecamatan = async (request, response, next) => {
  const db_kecamatan = path.resolve(__dirname, 'data/districts.csv');
  const { kode_kabupaten } = request.query;

  try {
    const data = await csvtojson().fromFile(db_kecamatan);
    return response.json(data.filter(kecamatan => kecamatan.kode_kabupaten === kode_kabupaten));
  } catch (error) {
    return response.json({
      error: 1,
      message: 'Gagal mengambil data kecamatan'
    })
  }
}

const getKelurahan = async (request, response, next) => {
  const db_kelurahan = path.resolve(__dirname, 'data/villages.csv');
  const { kode_kecamatan } = request.query;

  try {
    const data = await csvtojson().fromFile(db_kelurahan);
    return response.json(data.filter(kelurahan => kelurahan.kode_kecamatan === kode_kecamatan));
  } catch (error) {
    return response.json({
      error: 1,
      message: 'Gagal mengambil data kelurahan'
    })
  }
}

module.exports = {
  getProvinsi,
  getKabupaten,
  getKecamatan,
  getKelurahan,
}