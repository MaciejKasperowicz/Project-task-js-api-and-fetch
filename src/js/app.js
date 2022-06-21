import './../css/client.css';
import './../css/admin.css';
import ExcursionsAPI from './ExcursionsAPI';
import Admin from './admin';
import Client from './client';



document.addEventListener('DOMContentLoaded', init);

function init() {
    const excursionsAPI = new ExcursionsAPI("excursions");

    const admin = new Admin(excursionsAPI);
    admin.load();
    admin.add();
    admin.remove();
    admin.update();

    const client = new Client(excursionsAPI);
    client.loadExcursions();
    client.addExcursionsToSummary();
    client.removeExcursionsFromSummary();
    client.addExcursionsToOrders();

}