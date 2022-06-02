import './../css/admin.css';
import ExcursionsAPI from './ExcursionsAPI';
import Admin from './admin';


document.addEventListener('DOMContentLoaded', init);

function init() {
    const excursionsAPI = new ExcursionsAPI("excursions");

    const admin = new Admin(excursionsAPI);
    admin.loadExcursions();
    admin.addExcursions();
    admin.removeExcursions();
    admin.updateExcursions();

    console.log(admin)
}