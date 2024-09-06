const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const server = require('../server'); // Adjust the path as needed
const Data = require('../models/Data'); // Adjust the path as needed

chai.should();
chai.use(chaiHttp);

describe('Data API', () => {
  before((done) => {
    mongoose.connect('mongodb+srv://patelheta2512:cbx7EmgcTVmIphtR@cluster0.vtk6v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.once('open', () => {
      console.log('Connected to MongoDB');
      done();
    }).on('error', (error) => {
      console.warn('Error : ', error);
    });
  });

  it('should add data on /submit POST', (done) => {
    let data = {
      name: 'Test Name',
      amount: 100
    };
    chai.request(server)
      .post('/submit')
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        Data.findOne({ name: 'Test Name' }, (err, foundData) => {
          foundData.should.have.property('name').eql('Test Name');
          foundData.should.have.property('amount').eql(100);
          done();
        });
      });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });
});