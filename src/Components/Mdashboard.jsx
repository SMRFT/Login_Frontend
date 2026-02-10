import React, { useState, useEffect } from "react";
import styled, { keyframes, createGlobalStyle, css } from "styled-components";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";

// --- Global Theme (Modern Inter Clean) ---
const GlobalTheme = createGlobalStyle`
  :root {
    /* Professional Corporate Theme (Indigo & Slate) */
    --bg-body: #f8fafc; /* Slate 50 - Clean Light Background */
    --card-bg: #ffffff; /* Solid White Cards */
    --glass-border: 1px solid #e2e8f0; /* Subtle Slate Border */
    --glass-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    
    --text-dark: #0f172a; /* Slate 900 - Deep & Readable */
    --text-muted: #64748b; /* Slate 500 - Professional Grey */
    
    /* Brand Colors */
    --primary: #4f46e5;    /* Indigo 600 - Trustworthy & Modern */
    --primary-light: #818cf8; /* Indigo 400 */
    --accent: #6366f1;     /* Indigo 500 */
    --secondary: #3b82f6;  /* Blue 500 */
    
    /* Semantic Colors */
    --success: #10b981;    /* Emerald 500 */
    --warning: #f59e0b;    /* Amber 500 */
    --danger: #ef4444;     /* Red 500 */
    --purple: #8b5cf6;     /* Violet 500 */
    
    --chart-grid: rgba(0, 0, 0, 0.06);
  }

  body {
    background-color: var(--bg-body);
    font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
    color: var(--text-dark);
    -webkit-font-smoothing: antialiased;
  }
  
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent; 
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1; /* Slate 300 */
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8; /* Slate 400 */
  }
`;

// --- Animations ---
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Layout Components ---
const Layout = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  max-width: 1600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  padding: 1rem 2rem;
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: all 0.3s ease;

  &:hover {
    background: #ffffff;
    border-color: var(--primary);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.2rem;
  }
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  i {
    font-size: 1.8rem;
    color: var(--primary);
    filter: drop-shadow(0 4px 6px rgba(99, 102, 241, 0.25));
  }
  
  span {
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: -0.05em;
    color: var(--text-dark);
  }
`;

const LogoutBtn = styled.button`
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0,0,0,0.1);
  color: var(--text-dark);
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  
  &:hover {
    background: var(--primary);
    color: #ffffff;
    border-color: var(--primary);
    transform: translateY(-1px);
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 2rem;
`;

const WelcomeMsg = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 0 0.2rem 0;
    letter-spacing: -0.03em;
  }
  p {
    color: var(--text-muted);
    margin: 0;
    font-size: 0.95rem;
    font-weight: 400;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.4rem;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.1);
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: column;
    padding: 1rem;
  }
`;

const DateInput = styled.input`
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-dark);
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  outline: none;
  text-align: center;
  transition: all 0.2s;

  &::-webkit-calendar-picker-indicator {
    filter: invert(0);
    cursor: pointer;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  
  &:focus {
    background: rgba(0, 0, 0, 0.08);
    box-shadow: 0 0 0 2px var(--accent);
    border-color: var(--accent);
  }
`;

const Divider = styled.span`
  color: var(--text-muted);
  font-weight: 300;
  font-size: 1.2rem;
`;

const SearchButton = styled.button`
  background: var(--primary);
  color: #ffffff; /* White Text */
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 183, 181, 0.3);
  transition: all 0.2s;
  
  &:hover {
    background: #4cc9f0;
    transform: translateY(-1px);
    box-shadow: 0 0 20px rgba(0, 183, 181, 0.5);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// --- Dashboard Components ---
const Grid = styled.div`
  display: grid;
  gap: 2rem;
  margin-bottom: 2.5rem;
`;

const StatGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const ChartGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const GlassCard = styled.div`
  background: var(--card-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: var(--glass-border);
  border-radius: 20px;
  padding: 1.8rem;
  
  &:hover {
    transform: translateY(-5px);
    background: #ffffff;
    border-color: var(--primary-light);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const MetricTitle = styled.h3`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  margin: 0 0 1.2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  
  div {
      box-shadow: 0 0 15px currentColor; /* Glow effect for icons */
  }
`;

const MetricValue = styled.div`
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 0.8rem;
  letter-spacing: -1.5px;
  text-shadow: 0 0 10px rgba(255,255,255,0.3);
`;

const MetricTrend = styled.div`
  font-size: 0.9rem;
  color: ${props => props.positive ? 'var(--success)' : 'var(--danger)'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  background: ${props => props.positive ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 0, 85, 0.1)'};
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  width: fit-content;
  border: 1px solid ${props => props.positive ? 'rgba(0, 255, 157, 0.2)' : 'rgba(255, 0, 85, 0.2)'};
  
  span {
    color: var(--text-muted);
    font-weight: 500;
    font-size: 0.85rem;
  }
`;

const ChartTitle = styled.h2`
  font-size: 1.4rem;
  color: var(--text-dark);
  margin: 0 0 2rem 0;
  font-weight: 700;
  letter-spacing: -0.5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--primary));
    box-shadow: 0 0 10px var(--primary);
    border-radius: 2px;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  
  &:hover {
    transform: translateX(5px);
    border-color: var(--primary);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  
  span:first-child {
    color: var(--text-dark);
    font-weight: 700;
    font-size: 1rem;
  }
  
  span:last-child {
    font-size: 0.85rem;
    color: var(--text-muted);
  }
`;

const ItemValue = styled.span`
  color: var(--text-dark);
  font-weight: 700;
  font-family: 'Space Mono', monospace;
  font-size: 1.15rem;
  /* text-shadow: 0 0 5px currentColor; */
`;

// Custom Teal/Cyan Palette
const COLORS = ['#005461', '#018790', '#00B7B5', '#4cc9f0', '#f59e0b', '#e11d48', '#6366f1'];
const FINANCIAL_COLORS = {
  b2b: '#005461',           // Deep Teal
  home_collection: '#018790', // Medium Teal
  franchise_share: '#f59e0b', // Amber
  company_health_check: '#00B7B5', // Bright Cyan
  year_company_health_check: '#00B7B5',
  insurance: '#6366f1',     // Indigo
  milestone: '#4cc9f0',     // Light Blue
  er_billing: '#e11d48',    // Rose Red
  other: '#5e7a85',         // Muted Teal
  unknown: '#94a3b8'
};

import axios from 'axios';
import { useNavigate } from "react-router-dom";
const MDashboard = () => {
  const [data, setData] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Using import.meta.env for robust base URL handling in Vite
  const securityBaseUrl = import.meta.env.VITE_BACKEND_SECURITY_BASE_URL


  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFromDate(today);
    setToDate(today);
    fetchData(today, today);
  }, []);

  // Auto-fetch data when date range changes
  useEffect(() => {
    if (fromDate && toDate) {
      fetchData(fromDate, toDate);
    }
  }, [fromDate, toDate]);

  const fetchData = async (start, end) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(`${securityBaseUrl}m-dashboard-stats/`, {
        from_date: start,
        to_date: end
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.success) {
        setData(response.data.data);
      } else {
        toast.error("Failed to sync data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchData(fromDate, toDate);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const getSegmentLabel = (key) => {
    const labels = {
      home_collection: 'Home Collection',
      b2b: 'B2B / Clients',
      franchise: 'Franchise',
      company_health_check: 'Corp Health',
      insurance: 'Insurance',
      milestone: 'Milestone',
      er_billing: 'ER Billing',
      other: 'Other'
    };
    return labels[key] || key.replace(/_/g, ' ').toUpperCase();
  };

  const prepareSegmentData = () => {
    if (!data) return [];
    const segments = data.samples.segments;
    return Object.keys(segments).map((key, index) => ({
      name: getSegmentLabel(key),
      value: segments[key],
      fill: COLORS[index % COLORS.length]
    })).filter(item => item.value > 0);
  };

  const prepareRevenueData = () => {
    if (!data) return [];
    const gross = data.financials.gross;
    return Object.keys(gross).map((key, index) => ({
      name: getSegmentLabel(key),
      value: gross[key],
      fill: COLORS[index % COLORS.length]
    })).filter(item => item.value > 0);
  };

  const prepareHybridData = () => {
    if (!data) return [];

    // Explicitly define ALL segments we want to show, regardless of data
    const allKeys = [
      'b2b',
      'home_collection',
      'franchise_share',
      'company_health_check',
      'insurance',
      'milestone',
      'er_billing',
      'other'
    ];

    return allKeys.map((key) => {
      // Find matching key in backend response (sometimes inconsistent naming)
      // We map our 'rawKey' (e.g. franchise_share) to the backend key if needed or use direct

      let count = 0;
      let revenue = 0;

      // key map
      const segmentKey = key === 'franchise_share' ? 'franchise' : key;
      const financialKey = key; // usually matches

      count = data.samples.segments[segmentKey] || 0;
      revenue = data.financials.gross[financialKey] || 0;

      const avgValue = count > 0 ? (revenue / count) : 0;

      return {
        name: getSegmentLabel(key),
        rawKey: key,
        count: count,
        revenue: revenue,
        avgValue: Math.round(avgValue),
        fill: FINANCIAL_COLORS[key] || '#9ca3af'
      };
    }).sort((a, b) => b.revenue - a.revenue);
  };

  const segmentData = prepareSegmentData();
  const revenueData = prepareRevenueData();
  const hybridData = prepareHybridData();

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all auth items


    toast.info('Redirecting to modules...');
    navigate(`${import.meta.env.BASE_URL}secure`);
  };

  return (
    <Layout>
      <GlobalTheme />
      <HeaderBar>
        <LogoArea>
          <i className="bi bi-hexagon-fill"></i>
          <span>Shanmuga Metrics</span>
        </LogoArea>

        <LogoutBtn onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
          Home
        </LogoutBtn>
      </HeaderBar>

      <TopBar>
        <WelcomeMsg>
          <h1>Overview</h1>
          <p>Performance metrics for today.</p>
        </WelcomeMsg>

        <FilterGroup>
          <i className="bi bi-calendar4" style={{ color: 'var(--text-muted)', marginLeft: '0.8rem' }}></i>
          <DateInput type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <Divider>/</Divider>
          <DateInput type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </FilterGroup>
      </TopBar>

      {data ? (
        <>
          {/* --- 1. Global Overview Section --- */}
          <ChartTitle>Global Overview</ChartTitle>
          <StatGrid>
            <GlassCard delay="0.1s">
              <MetricTitle>
                Total Samples
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '8px', borderRadius: '12px', color: 'var(--primary)' }}>
                  <i className="bi bi-droplet-fill"></i>
                </div>
              </MetricTitle>
              <MetricValue>{data.samples.total}</MetricValue>
              <MetricTrend positive>
                <i className="bi bi-graph-up-arrow"></i>
                +12% <span>vs yesterday</span>
              </MetricTrend>
            </GlassCard>

            <GlassCard delay="0.2s">
              <MetricTitle>
                Tests Processed
                <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '8px', borderRadius: '12px', color: '#ec4899' }}>
                  <i className="bi bi-activity"></i>
                </div>
              </MetricTitle>
              <MetricValue>{data.tests.total}</MetricValue>
            </GlassCard>

            <GlassCard delay="0.3s">
              <MetricTitle>
                Net Revenue
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '12px', color: 'var(--success)' }}>
                  <i className="bi bi-currency-rupee"></i>
                </div>
              </MetricTitle>
              <MetricValue>{formatCurrency(data.financials.net_amount)}</MetricValue>
              <MetricTrend positive>
                <i className="bi bi-check-circle-fill"></i>
                Healthy <span>margin</span>
              </MetricTrend>
            </GlassCard>
          </StatGrid>

          {/* --- 2. Workforce & HR Section --- */}
          {data.employee_stats && (
            <>
              <ChartTitle style={{ marginTop: '2rem' }}>Workforce & HR</ChartTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                <GlassCard delay="0.15s">
                  <h3 style={{ color: 'var(--text-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="bi bi-people-fill" style={{ color: 'var(--secondary)' }}></i> Global Employees
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-dark)', lineHeight: 1 }}>
                        {data.employee_stats.total_employees}
                      </div>
                      <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Total Staff</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '50%' }}>
                      {/* Male Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="bi bi-gender-male" style={{ color: '#3f5efb' }}></i>
                        <div style={{ flex: 1, background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${(data.employee_stats.male / (data.employee_stats.total_employees || 1)) * 100}%`,
                            background: '#3f5efb',
                            height: '100%'
                          }}></div>
                        </div>
                        <span style={{ fontWeight: '600', minWidth: '30px' }}>{data.employee_stats.male}</span>
                      </div>

                      {/* Female Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="bi bi-gender-female" style={{ color: '#ec4899' }}></i>
                        <div style={{ flex: 1, background: '#e2e8f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${(data.employee_stats.female / (data.employee_stats.total_employees || 1)) * 100}%`,
                            background: '#ec4899',
                            height: '100%'
                          }}></div>
                        </div>
                        <span style={{ fontWeight: '600', minWidth: '30px' }}>{data.employee_stats.female}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard delay="0.25s">
                  <h3 style={{ color: 'var(--text-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="bi bi-person-check-fill" style={{ color: 'var(--success)' }}></i> Today's Attendance
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { value: data.employee_stats.attendance_today, fill: 'var(--success)' },
                              { value: (data.employee_stats.total_employees - data.employee_stats.attendance_today), fill: 'rgba(255,255,255,0.1)' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={45}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-dark)' }}>
                        {Math.round((data.employee_stats.attendance_today / (data.employee_stats.total_employees || 1)) * 100)}%
                      </div>
                    </div>

                    <div>
                      <MetricValue style={{ fontSize: '2.5rem', marginBottom: '0', color: 'var(--text-dark)' }}>
                        {data.employee_stats.attendance_today}
                      </MetricValue>
                      <div style={{ color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="bi bi-clock-history"></i> Live Count
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </>
          )}

          {/* --- 3. Departmental Performance Grid --- */}
          <ChartTitle style={{ marginTop: '3rem' }}>Departmental Performance</ChartTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {prepareHybridData().map((item, index) => {
              // Calculate contribution percentage for the mini-chart
              const totalRev = Object.values(data.financials.gross).reduce((a, b) => a + b, 0) || 1;
              const percentage = (item.revenue / totalRev) * 100;

              // Map Icons
              const icons = {
                b2b: 'bi-briefcase',
                home_collection: 'bi-house-heart',
                franchise_share: 'bi-shop',
                company_health_check: 'bi-building',
                insurance: 'bi-shield-check',
                milestone: 'bi-flag',
                er_billing: 'bi-hospital',
                other: 'bi-three-dots'
              };
              const iconClass = icons[item.rawKey] || 'bi-layers';

              return (
                <GlassCard key={item.rawKey} delay={`${0.1 * (index + 1)}s`} style={{ borderTop: `4px solid ${item.fill}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                      <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: '700', marginBottom: '0.4rem' }}>
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-dark)', fontFamily: 'Space Mono, monospace' }}>
                        {formatCurrency(item.revenue)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div style={{ background: `${item.fill}20`, color: item.fill, padding: '10px', borderRadius: '12px', boxShadow: `0 0 15px ${item.fill}40` }}>
                      <i className={`bi ${iconClass}`} style={{ fontSize: '1.2rem' }}></i>
                    </div>
                  </div>

                  {/* Mini Chart Section: Volume vs Share */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
                    <div style={{ width: '60px', height: '60px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { value: item.revenue, fill: item.fill },
                              { value: totalRev - item.revenue, fill: 'rgba(255,255,255,0.05)' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={20}
                            outerRadius={30}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                        <span>Samples</span>
                        <span style={{ color: 'var(--text-dark)', fontWeight: '600' }}>{item.count}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <span>Avg Tkt</span>
                        <span style={{ color: 'var(--text-dark)', fontWeight: '600' }}>₹{item.avgValue}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          <ChartGrid>
            <GlassCard delay="0.6s">
              <ChartTitle>Revenue Distribution</ChartTitle>
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={6}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ background: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '16px', color: 'var(--text-dark)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value) => <span style={{ color: 'var(--text-dark)', fontWeight: 500, fontSize: '0.85rem' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard delay="0.7s">
              <ChartTitle>Financial Summary</ChartTitle>
              <div style={{ overflowX: 'auto' }}>
                <List>
                  <ListItem style={{ background: '#ecfdf5', border: 'none', borderLeft: '4px solid var(--success)', boxShadow: 'none' }}>
                    <ItemInfo>
                      <span style={{ fontSize: '1.2rem', color: '#064e3b' }}>Total Net Revenue</span>
                      <span style={{ color: '#059669', fontSize: '0.85rem' }}>After all adjustments</span>
                    </ItemInfo>
                    <ItemValue style={{ fontSize: '1.5rem', color: 'var(--success)' }}>{formatCurrency(data.financials.net_amount)}</ItemValue>
                  </ListItem>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                    <ListItem style={{ background: '#fffbeb', border: '1px solid #fef3c7' }}>
                      <ItemInfo>
                        <span>Credit</span>
                        <span style={{ color: '#b45309', fontSize: '0.8rem' }}>Outstanding</span>
                      </ItemInfo>
                      <div style={{ color: '#d97706', fontWeight: 'bold' }}>{formatCurrency(data.financials.credit_amount)}</div>
                    </ListItem>
                    <ListItem>
                      <ItemInfo>
                        <span>Refunds</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Processed</span>
                      </ItemInfo>
                      <div style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>{formatCurrency(data.financials.refund_amount)}</div>
                    </ListItem>
                  </div>
                </List>
              </div>
            </GlassCard>
          </ChartGrid>
        </>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
          <p style={{ color: 'var(--text-muted)', opacity: 0.7, fontWeight: 500 }}>Loading Dashboard...</p>
        </div>
      )}
    </Layout>
  );
}

export default MDashboard;
