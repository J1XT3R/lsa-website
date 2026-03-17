import { useState, useEffect } from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Home from "./pages/Home"
import Elections from "./pages/Elections"
import ElectionBoard from "./pages/Elections/ElectionBoard"
import Layout from "./pages/Layout"
import Club from "./pages/Clubs/Club"
import TitleIX from './pages/Resources/TitleIX'
import FreshMenCorner from './pages/More/FreshmenCorner'
import Charter from './pages/About/Charter'
import ClubResources from './pages/Clubs/ClubResources'
import Wellness from './pages/Resources/Wellness'
import Clubs from './pages/Clubs/Clubs'
import AboutLSA from './pages/About/AboutLSA'
import Organization from './pages/Organizations/Organizations'
import ScrollToTop from "./components/ScrollToTop";
import SBC from './pages/About/SBC'
import DSA from './pages/About/DSA'
import ClassBoard from "./pages/About/ClassBoard"
import Site from './pages/More/Site'
import Committees from './pages/About/Committees'
import SpiritCommittee from './pages/About/SpiritCommittee'
import Committee from './pages/About/Committee'
import NewClub from './pages/Clubs/club_resources/NewClub'
import EventPlanning from './pages/Clubs/club_resources/EventPlanning'
import Fundraising from './pages/Clubs/club_resources/Fundraising'
import MockTrial from './pages/Organizations/MockTrial'
import ShieldAndScroll from './pages/Organizations/ShieldAndScroll'
import Archives from './pages/More/Archives'
import Forensic from './pages/Organizations/Forensic'
import Cardinalympics from './pages/Cardinalympics'
import { site } from './config/site.config.js'
import applicationsSheetConfig from './config/applications.config.js'
import ApplicationsOpen from './pages/ApplicationsOpen'

function App() {
    // main site data from Google Sheets (yes the key is here, we're not doing auth for a read-only sheet)
    const KEY = "AIzaSyAgshc5Aqd8B149h5RpsenMh_SQAeb4AXc";
    const SPREADSHEET_ID = "1Kk7Bs58DAWZ9pHvqD-RFvoV1ePeThQ1Yr9c5RsDeAq4";
    const SHEET_NAME = "Website Info"
    const SHEET_NAME2 = "Officers"
    const [clubData, setClubData] = useState([]);
    const [officerData, setOfficerData] = useState([]);

    // Cardinalympics has its own sheet - points and scoreboard
    const SPREADSHEET_ID2 = "1YoyeAEx3rFD2ctbrz3R0a0todgsNes76r_JH6MkYUO4";
    const SHEET_NAME3 = "Sp, 25";
    const [cardinalympicsData, setCardinalympicsData] = useState([0, 0, 0, 0]);
    const [scoreboardRows, setScoreboardRows] = useState([]);

    // elections results can come from a sheet later - for now we use config
    const SHEET_NAME4 = "Elections";
    const [electionData, setElectionData] = useState([]); // eslint-disable-line no-unused-vars

    // which clubs/orgs have applications open right now
    const [applicationsData, setApplicationsData] = useState([]);

    // okay so we have like 4 useEffects for 4 sheets - not pretty but it works
    useEffect(() => {
      async function fetchData() {
          try {
              // clubs + officers (first two sheets)
              const url1 = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${KEY}`;
              const res1 = await fetch(url1);
              const data1 = await res1.json();
              setClubData(processSheetData(data1.values));
  
              const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME2}?key=${KEY}`;
              const res2 = await fetch(url2);
              const data2 = await res2.json();
              setOfficerData(processSheetData(data2.values));
          } catch (error) {
              console.log(error);
          }
      }
      fetchData();
  }, []);

    useEffect(()=>{
      async function fetchElectionData() {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME4}?key=${KEY}`;
            const res = await fetch(url);
            const electionData = await res.json();
            setElectionData(processSheetData(electionData.values));
        } catch (error) {
            console.log(error);
        }
    }
      fetchElectionData();
    },[])


    useEffect(()=>{
      async function fetchCardinalympicsData() {
        try {
            const range = encodeURIComponent(SHEET_NAME3);
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID2}/values/${range}?key=${KEY}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.values && data.values.length > 0) {
              const totals = arrayCleanUp(data.values[0]);
              // sheet layout is inconsistent - sometimes 5 cols (points + 4 classes), sometimes just 4. fun!
              const classTotals = totals.length >= 5 ? totals.slice(-4) : totals.slice(0, 4);
              setCardinalympicsData(classTotals);
              setScoreboardRows(data.values);
            }
        } catch (error) {
            console.log(error);
        }
    }
      fetchCardinalympicsData();
    },[]);

    useEffect(() => {
      async function fetchApplicationsData() {
        try {
          const { spreadsheetId, sheetName } = applicationsSheetConfig;
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}?key=${KEY}`;
          const res = await fetch(url);
          const json = await res.json();
          if (json.error) {
            console.warn("Applications sheet fetch error:", json.error.message);
            return;
          }
          setApplicationsData(processApplicationsSheetData(json.values));
        } catch (error) {
          console.log(error);
        }
      }
      fetchApplicationsData();
    }, []);


    // this code is not great - sheet has random blanks and strings, we just shove numbers through and hope
    function arrayCleanUp(array) {
      const cleanedArray = [];
      for (let i = 0; i < array.length; i++) {
        if (array[i] !== "" && !isNaN(parseInt(array[i]))) {
          cleanedArray.push(parseInt(array[i]));
        }
      }
      return cleanedArray;
    }

    function processSheetData(data) {
        if (!data || data.length === 0) return [];
    
        const headers = data[0]; 
        const rows = data.slice(1);
    
        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || "";
            });
            return obj;
        });
    }

    // applications sheet loves to put a random title in row 1 - hunt for the actual header row
    function processApplicationsSheetData(data) {
        if (!data || data.length === 0) return [];
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(data.length, 5); i++) {
            const row = data[i];
            if (Array.isArray(row) && row.some(cell => {
                const s = String(cell || "").trim();
                return s === "Status" || s === "Name of Org/Club";
            })) {
                headerRowIndex = i;
                break;
            }
        }
        const headers = data[headerRowIndex];
        const rows = data.slice(headerRowIndex + 1);
        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                const key = String(header ?? "").trim() || `Column${index}`;
                obj[key] = row[index] != null ? String(row[index]) : "";
            });
            return obj;
        });
    }

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout clubData={clubData} electionsEnabled={site.electionsEnabled} electionsConfig={site.elections} />}>
            <Route path="/" element={<Home cardinalympicsData={cardinalympicsData} clubData={clubData} applicationsData={applicationsData} />} />
            <Route path="Elections" element={<Outlet />}>
              <Route index element={<Elections electionData={electionData} electionsEnabled={site.electionsEnabled} electionsConfig={site.elections} />} />
              <Route path=":boardSlug" element={<ElectionBoard electionsConfig={site.elections} />} />
            </Route>
            
            <Route path="LSA" element={<Outlet />}>
              <Route index element={<AboutLSA/>} />
              <Route path="SBC" element={<SBC officerData={officerData}/>} />
              <Route path=":BoardName" element={<ClassBoard officerData={officerData}/>} />
              <Route path="DSA" element={<DSA />} />
              <Route path="Charter" element={<Charter />}/>
              <Route path="Commitees" element={<Committees />} />
              <Route path="Spirit Committee" element={<SpiritCommittee />} />
              <Route path=":CommitteeName" element={<Committee/>} />
              
            </Route>

            <Route path="Organizations" element = {<Outlet />}>
              <Route index element={<Organization />} />
              <Route path="MockTrial" element={<MockTrial />} />
              <Route path="ShieldAndScroll" element={<ShieldAndScroll />} />
              <Route path="Forensic" element={<Forensic />} />
            </Route>

            <Route path="Clubs" element={<Outlet />}>
              <Route index element={<Clubs clubData={clubData}/>} />
              <Route path="ClubResources" element={<ClubResources />} />
              <Route path=":ClubName" element={<Club clubData={clubData}/>}/>
              <Route path="NewClub" element={<NewClub />} />
              <Route path="EventPlanning" element={<EventPlanning />} />
              <Route path="Fundraising" element={<Fundraising />} />
            </Route>

            <Route path="ApplicationsOpen" element={<ApplicationsOpen applicationsData={applicationsData} />} />
            <Route element={<Outlet />}>
              <Route path="Wellness" element={<Wellness />} />
              <Route path="TitleIX" element = {<TitleIX />} />
            </Route>
            
            <Route path="FreshmenCorner" element= {<FreshMenCorner />} />
            <Route path="AboutSite" element={<Site />} />
            <Route path="Archives" element={<Archives />} />
            <Route path="Cardinalympics" element={<Cardinalympics cardinalympicsData={cardinalympicsData} scoreboardRows={scoreboardRows} />} />  
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
