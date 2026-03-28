import { useState, useEffect } from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Home from "./pages/Home"
import Elections from "./pages/Elections"
import ElectionBoard from "./pages/Elections/ElectionBoard"
import ElectionResults from "./pages/Elections/ElectionResults"
import Layout from "./pages/Layout"
import Club from "./pages/Clubs/Club"
import TitleIX from './pages/Resources/TitleIX'
import FreshMenCorner from './pages/More/FreshmenCorner'
import Charter from './pages/About/Charter'
import ClubResources from './pages/Clubs/ClubResources'
import Wellness from './pages/Resources/Wellness'
import Resources from './pages/Resources/Resources'
import Clubs from './pages/Clubs/Clubs'
import AboutLSA from './pages/About/AboutLSA'
import Organization from './pages/Organizations/Organizations'
import ScrollToTop from "./components/ScrollToTop";
import SBC from './pages/About/SBC'
import DSA from './pages/About/DSA'
import Site from './pages/More/Site'
import Events from './pages/More/Events'
import Committees from './pages/About/Committees'
import SpiritCommittee from './pages/About/SpiritCommittee'
import LsaTeamPage from './pages/About/LsaTeamPage'
import LSAExplore from './pages/About/LSAExplore'
import Registry from './pages/Registry/Registry'
import NewClub from './pages/Clubs/club_resources/NewClub'
import EventPlanning from './pages/Clubs/club_resources/EventPlanning'
import Fundraising from './pages/Clubs/club_resources/Fundraising'
import MockTrial from './pages/Organizations/MockTrial'
import ShieldAndScroll from './pages/Organizations/ShieldAndScroll'
import Archives from './pages/More/Archives'
import More from './pages/More/More'
import Forensic from './pages/Organizations/Forensic'
import Cardinalympics from './pages/Cardinalympics'
import { site } from './config/site.config.js'
import applicationsSheetConfig from './config/applications.config.js'
import ApplicationsOpen from './pages/ApplicationsOpen'
import Announcements from './pages/Announcements'

function App() {
    // main site data from Google Sheets (yes the key is here, we're not doing auth for a read-only sheet)
    const KEY = "AIzaSyAgshc5Aqd8B149h5RpsenMh_SQAeb4AXc";
    const SPREADSHEET_ID = "1Kk7Bs58DAWZ9pHvqD-RFvoV1ePeThQ1Yr9c5RsDeAq4";
    const SHEET_NAME = "Website Info"
    const SHEET_NAME2 = "Officers"
    const [clubData, setClubData] = useState([]);
    const [officerData, setOfficerData] = useState([]);

    // Cardinalympics points and scoreboard
    const SPREADSHEET_ID2 = "1YoyeAEx3rFD2ctbrz3R0a0todgsNes76r_JH6MkYUO4";
    const SHEET_NAME3 = "Sp, 25";
    const [cardinalympicsData, setCardinalympicsData] = useState([0, 0, 0, 0]);
    const [scoreboardRows, setScoreboardRows] = useState([]);

    // elections results can come from a sheet later - for now we use config
    const SHEET_NAME4 = "Elections";
    const [electionData, setElectionData] = useState([]);

    // which clubs/orgs have applications open right now
    const [applicationsData, setApplicationsData] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(true);
    const [applicationsError, setApplicationsError] = useState(null);

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


    const CARDINALYMPICS_POLL_MS = 30_000;

    useEffect(() => {
      // Refreshes class totals (home + Cardinalympics & detailed scoreboard)
      async function fetchCardinalympicsData() {
        try {
          const range = encodeURIComponent(SHEET_NAME3);
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID2}/values/${range}?key=${KEY}`;
          const res = await fetch(url, { cache: "no-store" });
          const data = await res.json();
          if (data.values && data.values.length > 0) {
            const totals = arrayCleanUp(data.values[0]);
            const classTotals = totals.length >= 5 ? totals.slice(-4) : totals.slice(0, 4);
            setCardinalympicsData(classTotals);
            
            // Clone rows so React always sees a new reference when the sheet updates (table re-renders every poll).
            setScoreboardRows(data.values.map((row) => (Array.isArray(row) ? [...row] : row)));
          }
        } catch (error) {
          console.log(error);
        }
      }

      fetchCardinalympicsData();
      const pollId = setInterval(fetchCardinalympicsData, CARDINALYMPICS_POLL_MS);
      return () => clearInterval(pollId);
    }, []);

    useEffect(() => {
      async function fetchApplicationsData() {
        setApplicationsError(null);
        setApplicationsLoading(true);
        try {
          const { spreadsheetId, sheetName, sheetNames } = applicationsSheetConfig;
          const names = sheetNames?.length
            ? sheetNames
            : [sheetName].filter(Boolean);

          let lastError = null;
          for (const name of names) {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(name)}?key=${KEY}`;
            const res = await fetch(url);
            const json = await res.json();
            if (json.error) {
              lastError = json.error.message || "Unknown API error";
              console.warn("Applications sheet fetch:", name, lastError);
              continue;
            }
            setApplicationsData(processApplicationsSheetData(json.values));
            return;
          }
          setApplicationsData([]);
          setApplicationsError(
            lastError || "Could not load the applications spreadsheet tab."
          );
        } catch (error) {
          console.warn(error);
          setApplicationsData([]);
          setApplicationsError(error?.message || "Network error loading applications.");
        } finally {
          setApplicationsLoading(false);
        }
      }
      fetchApplicationsData();
    }, []);


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

    // applications sheet 
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
              <Route path="Results" element={<ElectionResults electionData={electionData} electionsEnabled={site.electionsEnabled} electionsConfig={site.elections} />} />
            </Route>
            
            <Route path="LSA" element={<Outlet />}>
              <Route index element={<AboutLSA/>} />
              <Route path="SBC" element={<SBC officerData={officerData}/>} />
              <Route path="DSA" element={<DSA />} />
              <Route path="Charter" element={<Charter />}/>
              <Route path="Commitees" element={<Committees />} />
              <Route path="Spirit Committee" element={<SpiritCommittee />} />
              <Route path=":BoardName" element={<LsaTeamPage officerData={officerData} />} />
              
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

            <Route
              path="ApplicationsOpen"
              element={
                <ApplicationsOpen
                  applicationsData={applicationsData}
                  applicationsLoading={applicationsLoading}
                  applicationsError={applicationsError}
                />
              }
            />
            <Route path="Announcements" element={<Announcements />} />
            <Route path="Resources" element={<Outlet />}>
              <Route index element={<Resources />} />
              <Route
                path="ApplicationsOpen"
                element={<Navigate to="/ApplicationsOpen" replace />}
              />
              <Route path="Wellness" element={<Wellness />} />
              <Route path="TitleIX" element={<TitleIX />} />
            </Route>
            <Route path="LSA-EXPLORE" element={<LSAExplore />} />
            <Route path="Wellness" element={<Navigate to="/Resources/Wellness" replace />} />
            <Route path="TitleIX" element={<Navigate to="/Resources/TitleIX" replace />} />
            
            <Route path="FreshmenCorner" element= {<FreshMenCorner />} />
            <Route path="Registry" element={<Registry />} />
            <Route path="Events" element={<Events />} />
            <Route path="AboutSite" element={<Site />} />
            <Route path="Archives" element={<Archives />} />
            <Route path="Cardinalympics" element={<Cardinalympics cardinalympicsData={cardinalympicsData} scoreboardRows={scoreboardRows} />} />  
            <Route path="More" element={<More />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App