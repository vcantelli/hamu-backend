module.exports = app => {
    app.get('/', (req, res) => res.render('index.ejs', { title: 'Express' }));
    app.get('/invention', (req, res) => res.render('invention.ejs', { title: 'Create invention' }));
}