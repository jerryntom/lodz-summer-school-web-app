import './App.css';
import logoLodzUniversityOfTechnology from './resources/logo-lodz-university-of-technology.png';
import logoUniversityOfLodz from './resources/logo-university-of-lodz.png';
import ImageCarousel from './ImageCarousel';
import { useEffect, useState } from 'react';
import { db, storage } from "./config/firebase.js"
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

const photos = [
  {
    id: 'p1',
    title: 'Zdjęcie grupa studentów śmieje się podczas nauki przy laptopach w bibliotece',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 'p2',
    title: 'Zdjęcie dwóch kolegów z pracy pracuje i rozmawia ze sobą przy stole',
    url: 'https://images.unsplash.com/photo-1579389082978-de4aece6f446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 'p3',
    title: 'Zdjęcie stół z wyposażeniem do laboratorium elektroniki: kable, multimetr, płytki stykowe',
    url: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 'p4',
    title: 'Zdjęcie młody mężczyzna maluje obraz z zestawem VR na głowie',
    url: 'https://images.unsplash.com/photo-1502185635613-0a5b2e78efea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
];

function App() {
  const participantCollectionRef = collection(db, "participants");

  const [participantsList, setParticipantsList] = useState([]);
  const [newName, setNewName] = useState("");
  const [newSurname, setNewSurname] = useState("");
  const [newBirthDate, setNewBirthDate] = useState("");
  const [newTelephone, setNewTelephone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [agreement, setNewAgreement] = useState(false);

  useEffect(() => {
    const getParticipantsList = async () => {
      try {
        const part_list = await getDocs(participantCollectionRef);
        const part_list_data = part_list.docs.map((doc) => ({
          ...doc.data(), 
        }));

        setParticipantsList(part_list_data);
      } catch (err) {
        console.error(err);
      }
    }

    getParticipantsList();
  }, []);

  const submitData = async (event) => {
    event.preventDefault();
    var form_response_name = document.getElementById('form-response-name');
    var form_response_surname = document.getElementById('form-response-surname');
    var form_response_birthdate = document.getElementById('form-response-birthdate');
    var form_response_tel = document.getElementById('form-response-tel');
    var form_response_email = document.getElementById('form-response-email');
    var form_response_file = document.getElementById('form-response-file');
    var form_response_agreement = document.getElementById('form-response-agreement');
    var form_response_final = document.getElementById('form-response-final')

    form_response_name.innerHTML = '';
    form_response_surname.innerHTML = '';
    form_response_birthdate.innerHTML = '';
    form_response_tel.innerHTML = '';
    form_response_email.innerHTML = '';
    form_response_file.innerHTML = '';
    form_response_agreement.innerHTML = '';
    form_response_final.innerHTML = '';

    const validName = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]{1,100}$/;
    if(!validName.test(newName) || newName === "" || newName.length > 100) {
      form_response_name.innerHTML = 'Imię może zawierać litery tylko z polskiego alfabetu oraz mieć długość 1-100!';
      form_response_final.innerHTML = 'Prosimy o poprawienie danych.';
      document.getElementById('form-name').focus();
      return -1;
    }  

    const validSurname = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]{1,100}$/;
    if(!validSurname.test(newSurname) || newSurname === "" || newSurname.length > 100) {
      form_response_surname.innerHTML = 'Nazwisko może zawierać litery tylko z polskiego alfabetu oraz mieć długość 1-100!';
      form_response_final.innerHTML = 'Prosimy o poprawienie danych.';
      document.getElementById('form-surname').focus();
      return -1;
    }  

    if(newBirthDate === "") {
      form_response_birthdate.innerHTML = 'Data urodzenia nie może być pusta!';
      form_response_final.innerHTML = 'Prosimy o poprawienie danych.';
      document.getElementById('form-birthdate').focus();
      return -1;
    }

    const validTelephone = /^[0-9]{9}$/;
    if(!validTelephone.test(newTelephone) || newTelephone === "" || newTelephone.length > 9 || newTelephone.length < 9) {
      form_response_tel.innerHTML = 'Numer telefonu może zawierać tylko liczby oraz składać się wyłącznie z 9 cyfr! Podaj numer jako sekwencję cyfr.';
      form_response_final.innerHTML = 'Prosimy o poprawienie danych.';
      document.getElementById('form-tel').focus();
      return -1;
    }  

    const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!validEmail.test(newEmail) || newEmail === "") {
      form_response_email.innerHTML = 'Podano niepoprawny adres e-mail!' + '<br>' + 'Przykład: adres@poczta.pl' + '<br></br>';
      form_response_final.innerHTML = 'Prosimy o poprawienie danych.';
      document.getElementById('form-email').focus();
      return -1;
    }  

    let exists = 0;

    participantsList.forEach((participant) => {
      if(participant["email"] === newEmail) {
        exists = 1;
      }
    });
        
    if(exists === 1) {
      form_response_email.innerHTML = 'Uczestnik o podanym adresie email już istnieje!';
      form_response_final.innerHTML = 'Prosimy o poprawienie danych.';
      document.getElementById('form-email').focus();
      return -1;
    }

    if(!fileUpload) {
      form_response_file.innerHTML = 'Brak załączonego pliku!';
      form_response_final.innerHTML = 'Prosimy o poprawienie danych.';
      return -1;
    }

    if (!fileUpload["name"].endsWith(".pdf")) {
      form_response_file.innerHTML = 'Niepoprawne rozszerzenie pliku! Prosimy o załączenie poprawnego pliku pdf.';
      form_response_final.innerHTML = 'Prosimy o poprawienie danych';
      return -1;
    }

    if(agreement === false) {
      form_response_agreement.innerHTML = 'Prosimy o zaakceptowanie regulaminu!';
      form_response_final.innerHTML = 'Prosimy o poprawienie danych';
      return -1;
    }

    form_response_final.innerHTML = 'Zapisano poprawnie! Dziękujemy!'

    const filesUploadLocation = ref(storage, `${newEmail}.pdf`);
    try {
      await uploadBytes(filesUploadLocation, fileUpload);
    } catch (err) {
      console.error(err);
    }

    if (newBirthDate !== "" && 
    newEmail !== "" && 
    newName !== "" && 
    newSurname !== "" && 
    newTelephone !== "") {
      try {
        await addDoc(participantCollectionRef, {
          birth_date: newBirthDate,
          email: newEmail,
          name: newName,
          surname: newSurname,
          telephone: newTelephone,
        });


        setNewName("");
        setNewSurname("");
        setNewBirthDate("");
        setNewTelephone("");
        setNewEmail("");
        setFileUpload(null);
        setNewAgreement(false);

        document.getElementById('form-name').value = "";
        document.getElementById('form-surname').value = "";
        document.getElementById('form-email').value = "";
        document.getElementById('form-tel').value = "";
        document.getElementById('form-birthdate').value = "";
        document.getElementById('form-file').value = null;
        document.getElementById('statute-acknowledge').checked = false;
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className='app'>
      <nav id="menu" className="navbar navbar-expand-md navbar-light fixed-top">
        <div className="container" id='menu-container'>
          <button className="navbar-toggler custom-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            <p id="menu-p">Menu</p>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a href="#about-summer-school" aria-label='menu link do sekcji o szkole letniej' className="nav-link">O szkole letniej</a>
              </li>
              <li className="nav-item">
                <a href="#organizers" aria-label='menu link do sekcji organizatorzy' className="nav-link">Organizatorzy</a>
              </li>
              <li className="nav-item">
                <a href="#edition-I" aria-label='menu link do sekcji edycja I' className="nav-link">Edycja I</a>
              </li>
              <li className="nav-item">
                <a href="#enrollment-form" aria-label='menu link do sekcji zapisy' className="nav-link">Zapisy</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className='block-divider-menu'><p></p></div>
      <div id='banner-info' className='container-fluid'>
        <div className='row'>
          <div className='col-md-3'><h1>Łódzka</h1></div>
        </div>
        <div className='row'>
          <div className='col-md-3'><h1>Szkoła</h1></div>
        </div>
        <div className='row'>
          <div className='col-md-3'><h1>Letnia</h1></div>
        </div>
        <div className='row'>
          <div className='col-md-3'><h1>Edycja II</h1></div>
        </div>
      </div>
      <div id='organizers-logo' className='container-fluid'>
        <a href='https://p.lodz.pl/' aria-label='link logo strona politechnika łódź (otwórz w nowej karcie)' rel="noreferrer" target='_blank'><img src={logoLodzUniversityOfTechnology} alt="link logo strona politechnika łódź (otwórz w nowej karcie)" 
        title='link logo strona politechnika łódź (otwórz w nowej karcie)'></img></a>
        <a href='https://www.uni.lodz.pl/' aria-label='link logo strona uniwersytet łódź (otwórz w nowej karcie)' rel="noreferrer" target='_blank'><img src={logoUniversityOfLodz} alt="link logo strona uniwersytet łódź (otwórz w nowej karcie)"
        title='link logo strona uniwersytet łódź (otwórz w nowej karcie)'></img></a>
      </div>
      <p id='about-summer-school' className='section'></p>
      <div className='block-divider'><p></p></div>
      <div className='container-fluid'>
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col-md-6 text-center'>
            <img className='img-content' src='https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
            alt = 'zdjęcie kobieta podczas spotkania zespołu omawia bieżące zadania oraz zarządza nimi za pomocą samoprzylepnych karteczek'></img>
          </div>
          <div className='col-md-6 text-center'>
            <h1>O szkole letniej</h1>
            <p className='paragraph-content'>
              Szkoła letnia to innowacyjny projekt międzynarodowego Konsorcjum uczelni wyższych przeznaczony dla studentów Politechniki Łódzkiej i Uniwersytetu Łódzkiego. 
              Jej głównym celem jest zweryfikowanie, czy faktyczne zdolności posiadane przez jej uczestników pokrywają się z ukierunkowaniem uczelni, na której odbywają naukę. 
              Zgromadzone w ten sposób dane stanowić będą podstawę reformy szkolnictwa wyższego zaproponowanej przez Konsorcjum.
            </p>
          </div>
        </div>
      </div>
      <div className='block-divider'><p></p></div>
      <div className='container-fluid'>
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col-md-6'>
            <h1 className='text-center'>Dlaczego warto?</h1>
            <ul className='list-content'>
              <li>Gwarancja rozwoju kompetencji miękkich oraz twardych</li>
              <li>Możliwość sprawdzenia się na tle innych studentów</li>
              <li>Interesujące wyzwania przeprowadzane pod okiem wykwalifikowanych ekspertów</li>
              <li>Networking - poznanie wielu ludzi z różnych środowisk</li>
              <li>Możliwość realnej oceny posiadanych umiejętności oraz otworzenia się na nowe doświadczenia</li>
            </ul>
          </div>
          <div className='col-md-6 text-center'>
            <img className='img-content' src='https://images.unsplash.com/photo-1598257006626-48b0c252070d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
            alt = 'zdjęcie zamyślona, elegancko ubrana kobieta podczas pracy przy laptopie'></img>
          </div>
        </div>
      </div>
      <p id='organizers' className='section'></p>
      <div className='block-divider'><p></p></div>
      <div className='container-fluid'>
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col-md-6 text-center'>
            <img className='img-content' src='https://p.lodz.pl/sites/default/files/2021-05/politechnikia-lodzka_004_1476_634.jpg'
            alt = 'zdjęcie duży ceglany budynek - budynek LODEX Politechniki Łódzkiej. Przed budynkiem park z niewielkim stawem, który ma fontannę pośrodku'></img>
          </div>
          <div className='col-md-6 text-center'>
            <h1>Politechnika Łódzka</h1>
            <p className='paragraph-content'>
              Politechnika Łódzka to jedna z najlepszych uczelni technicznych w Polsce, która już od 78 lat kształci niezwykle utalentowanych studentów na poziome studiów I stopnia, studiów inżynierskich i licencjackich oraz na poziomie studiów II stopnia. 
              Oferuje aż 60 różnych kierunków studiów oraz stwarza możliwość kształcenia w zakresie dziedziny nauk inżynieryjno – technicznych, dziedziny nauk ścisłych i przyrodniczych, dziedziny nauk społecznych, w zakresie dziedziny nauk rolniczych oraz w dziedzinie sztuki.
            </p>
          </div>
        </div>
      </div>
      <div className='block-divider'><p></p></div>
      <div className='container-fluid'>
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col-md-6 text-center'>
            <h1>Uniwersytet Łódzki</h1>
            <p className='paragraph-content'>
              Uniwersytet Łódzki to uczelnia wyższa wielokrotnie nagradzana w różnego rodzaju plebiscytach i rankingach. 
              Cieszy się dobrą sławą nie tylko w Polsce, ale i na całym świecie. 
              Oferta kształcenia obejmuje aż 100 kierunków studiów na 13 wydziałach. 
              Studentów UŁ cechuje kreatywne podejście do kształcenia,  otwartość na to, co nowe i nieoczywiste, a także odważne dążenie do innowacyjnych rozwiązań.
            </p>
          </div>
          <div className='col-md-6 text-center'>
            <img className='img-content' src='https://smapse.com/storage/2021/06/6-8.jpg'
            alt = 'zdjęcie nowoczesny budynek wydziału filologii Uniwersytetu Łódzkiego'></img>
          </div>
        </div>
      </div>
      <p id='edition-I' className='section'></p>
      <div className='block-divider'><p></p></div>
      <div className='container-fluid'>
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col-md-6 text-center'>
            <img className='img-content' src='https://images.pexels.com/photos/7005500/pexels-photo-7005500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            alt = 'zdjęcie szczęśliwy mężczyzna na ciemnoniebieskim tle z uniesionym trofeum w prawej dłoni'></img>
          </div>
          <div className='col-md-6 text-center'>
            <h1>Edycja I podsumowanie</h1>
            <p className='paragraph-content'>
              Pierwsza edycja szkoły letniej okazała się wielkim sukcesem, zainteresowanie projektem było ogromne i przerosło ono wszelkie oczekiwania organizatorów. 
              Łącznie wzięło w nim  udział 100 studentów Politechniki Łódzkiej i Uniwersytetu Łódzkiego. 
              Uczestnicy świetnie poradzili sobie zarówno z zadaniami praktycznymi jak i teoretycznymi. 
              Rywalizacja między uczelniami była naprawdę wyrównana, ale finalnie to przedstawiciele Politechniki Łódzkiej zgromadzili o 3 punkty więcej i zwyciężyli w tym niezwykle pasjonującym pojedynku. 
              Dziękujemy za zaangażowanie i zapraszamy za rok!
            </p>
          </div>
        </div>
      </div>
      <div className='block-divider'><p></p></div>
      <div className='container-fluid'>
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col-md-6 text-center'>
            <h1>Edycja I galeria</h1>
            <ImageCarousel photos={photos}/>
          </div>
        </div>
      </div>
      <p id='enrollment-form' className='section'></p>
      <div className='block-divider'><p></p></div>
      <div className='container-fluid'>
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col-md-6 text-center justify-content-center'>
            <span id='form-info'>
              <h1>Podejmij wyzwanie już 30.07<br></br>zapisz się na szkołę letnią</h1>
              <p className='asterisk-required'>* wymagane</p>
            </span>
              <form id='enrollment-form-content' className='justify-content-center'>      
                <p className='asterisk-required'>*</p>
                <label htmlFor='form-name'>Imię</label><br></br>
                <input type="text" id="form-name" name="name" placeholder='Imię' onChange={(e) => setNewName(e.target.value)}
                required/><br></br>
                <p className='form-text form-response-text' id='form-response-name'></p>
                <p className='asterisk-required'>*</p>
                <label htmlFor='form-surname'>Nazwisko</label><br></br>
                <input type="text" id="form-surname" name="surname" placeholder='Nazwisko' onChange={(e) => setNewSurname(e.target.value)}
                required/><br></br>
                <p className='form-text form-response-text' id='form-response-surname'></p>
                <p className='asterisk-required'>*</p>
                <label htmlFor='form-birthdate'>Data ur.</label><br></br>
                <input type="date" id="form-birthdate" name="birthdate" onChange={(e) => setNewBirthDate(e.target.value)}
                required/><br></br>
                <p className='form-text form-response-text' id='form-response-birthdate'></p>
                <p className='asterisk-required'>*</p>
                <label htmlFor='form-tel'>Nr. tel.</label><br></br>
                <input type="tel" id="form-tel" name="tel" placeholder='Nr. tel.' onChange={(e) => setNewTelephone(e.target.value)}
                required/><br></br>
                <p className='form-text form-response-text' id='form-response-tel'></p>
                <p className='asterisk-required'>*</p>
                <label htmlFor='form-email'>Adres e-mail</label><br></br>
                <input type="email" id="form-email" name="email" placeholder='Adres e-mail' onChange={(e) => setNewEmail(e.target.value)}
                required/><br></br>
                <p className='form-text form-response-text' id='form-response-email'></p>
                <p className='form-text'>
                  <span className='asterisk-required'>*</span>
                  Załącz plik pdf z krótką pracą pisemną na swój temat (zainteresowania, osobowość, cele osobiste)
                  oraz oczekiwania związane ze szkołą letnią, wyznawane wartości itd.)
                </p>
                <input type='file' id="form-file" placeholder="załaduj plik pdf" accept="application/pdf" onChange={(e) => setFileUpload(e.target.files[0])}></input><br></br>
                <p className='form-text form-response-text' id='form-response-file'></p>
                <input type='checkbox' name="statute-acknowledge-checkbox" aria-label='zaznacz potwierdzenie regulaminu' id='statute-acknowledge' checked={agreement} onChange={(e) => setNewAgreement(e.target.checked)} required></input>
                <p className='asterisk-required'>*</p>
                <label htmlFor='statute-acknowledge'>Oświadczam, że zapoznałem(-am) się z treścią <a href='https://loremipsum.io/' aria-label="link regulamin szkoły letniej pdf" rel="noreferrer" target='_blank'>regulaminu</a></label>
                <p className='form-text form-response-text' id='form-response-agreement'></p>
                <input type="submit" name="submit-button" onClick={submitData} value="Wyślij"/><br></br>
                <p className='form-text' id='form-response-final'></p>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
