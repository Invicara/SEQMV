import React, { useEffect, useState, useRef } from 'react';
import { ScriptCache } from "@invicara/ipa-core/modules/IpaUtils";
import { makeStyles, Button, Select, MenuItem, CircularProgress } from "@mui/material";
import moment from 'moment';
import './LeaseManagement.css';
import PieChart from './charts/PieChart'
import LeasesExpiringChart from './charts/LeasesExpiringChart';
import TopOccupantsBarChart from './charts/TopOccupantsBarChart';
import LineChartCard from './charts/LineChartCard ';

const LeaseManagement = ({ selectedItems, ...props }) => {
    const [leaseData, setleaseData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalLeaseData, setTotalLeaseData] = useState([]);
    const [leaseStatData, setLeaseStatData] = useState([]);
    const [occupancyDistribution, setOccupancyDistribution] = useState([]);
    const [topFiveOccupentbySpace, setTopFiveOccupentbySpace] = useState([]);
    const [leaseExpire, setLeaseExpire] = useState([]);
    const [waterEnergyMeter, setWaterEnergyMeter] = useState([]);
    const [totalWaterEnergyMeter, setTotalWaterEnergyMeter] = useState([]);
    const [waterConsumption, setWaterConsumption] = useState([]);
    const [energyConsumption, setEnergyConsumption] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState('Emirates');
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [levelsName, setLevelsName] = useState([]);
    const [buildingName, setBuildingName] = useState([]);
    const [uniqueCustomers, setUniqueCustomers] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch lease data
                const leaseSpaceData = await ScriptCache.runScript(props.handler.config.entityData.getLeaseSpaces.script, {});
                console.log('get lease spaces :---->', leaseSpaceData);
                setleaseData(leaseSpaceData);
                setTotalLeaseData(leaseSpaceData);

                // Fetch water & energy data
                const energyData = await ScriptCache.runScript(props.handler.config.entityData.getMeterData.script, {});
                console.log('get water ennergy data :---->', energyData);
                setWaterEnergyMeter(energyData);
                setTotalWaterEnergyMeter(energyData);

                // Extract unique customer names
                const uniqueCustomerNames = [
                    ...new Set(
                        energyData.map(item => item?.properties?.["Customer Name"]?.val).filter(Boolean)
                    )
                ];
                console.log('setUniqueCustomers:--->', uniqueCustomerNames);
                setUniqueCustomers(uniqueCustomerNames);

                // Fetch Building & level data
                const buildingData = await ScriptCache.runScript(props.handler.config.entityData.getBuildingData.script, {});
                console.log('get Building & level data :---->', buildingData);
                // setWaterEnergyMeter(energyData);
                // setTotalWaterEnergyMeter(energyData);
                const uniqueBuildings = [
                    ...new Set(
                        buildingData.map(item => item?.properties?.["Building"]?.val).filter(Boolean)
                    )
                ];

                const uniqueLevels = [
                    ...new Set(
                        buildingData.map(item => item?.properties?.["Level"]?.val).filter(Boolean)
                    )
                ];

                console.log("Unique Buildings:", uniqueBuildings);
                console.log("Unique Levels:", uniqueLevels);
                setLevelsName(uniqueLevels)
                setBuildingName(uniqueBuildings)

            } catch (error) {
                console.error('Error in getting data :----->', error);
            } finally {
                setIsLoading(false); // ✅ set to false when done
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const availableSpace = await getAvailableSpace();
                const occupiedSpace = await getOccupiedSpace();
                const revenue = await getOccupiedSpaceRevenue();
                const occupancyDistribution = await getOccupancyDistribution()
                const topFiveOccupent = await getTopFiveOccupantsBySpace()
                const leasesExpiring = await getLeasesExpiring()
                console.log('Lease expire meter:--->',leasesExpiring)
                setLeaseStatData(
                    [
                        {
                            label: 'Available space (m²)',
                            value: `${availableSpace.toLocaleString()} m²`,
                        },
                        {
                            label: 'Occupied space (m²)',
                            value: `${occupiedSpace.toLocaleString()} m²`,
                        },
                        {
                            label: 'Revenue from occupied space',
                            value: `₹ ${revenue.toLocaleString()}`,
                        },
                    ]
                )
                setOccupancyDistribution(occupancyDistribution)
                setTopFiveOccupentbySpace(topFiveOccupent)
                setLeaseExpire(leasesExpiring)

            } catch (error) {
                console.error('Error fetching space data:', error);
            }
        };
        fetchData();
    }, [leaseData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eneryChartData = await consumptionChartData();
                console.log('final enery chart data :--->', eneryChartData)
                setWaterConsumption(eneryChartData.waterData)
                setEnergyConsumption(eneryChartData.energyData)
            } catch (error) {
                console.error('Error fetching space data:', error);
            }
        };
        fetchData();
    }, [waterEnergyMeter]);


    const getAvailableSpace = async () => {
        const totalAvailableSpace = parseFloat(
            leaseData.reduce((sum, data) => sum + parseFloat(data.properties.Area.val), 0).toFixed(2)
        );

        console.log('Total space: ---->', totalAvailableSpace);
        return totalAvailableSpace
    };

    const getOccupiedSpace = async () => {
        const totalOccupiespace = parseFloat(
            leaseData
                .filter(data => data.properties["Rental Status"]?.val?.toLowerCase() == "true")
                .reduce((sum, data) => sum + parseFloat(data.properties.Area.val), 0)
                .toFixed(2)
        );

        console.log('Total occupied rent: ---->', totalOccupiespace);
        return totalOccupiespace
    };

    const getOccupiedSpaceRevenue = async () => {
        const totalOccupiedRevenue = parseFloat(
            leaseData
                .filter(data => data.properties["Rental Status"]?.val?.toLowerCase() == "true")
                .reduce((sum, data) => sum + parseFloat(data.properties["Rental Charges"].val), 0)
                .toFixed(2)
        );

        console.log('Total revenue rent: ---->', totalOccupiedRevenue);
        return totalOccupiedRevenue
    };

    const getOccupancyDistribution = async () => {
        const categoryCounts = {};

        leaseData.forEach(data => {
            const category = data.properties["Room Function"].val;
            if (category) {
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
        });

        const total = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

        const colors = [
            '#FBC02D', '#0E77B7', '#62B8AA', '#A43FC8'
        ];

        let colorIndex = 0;

        const occupancyDistribution = Object.entries(categoryCounts).map(([id, count]) => ({
            id,
            value: parseFloat(((count / total) * 100).toFixed(2)),
            color: colors[colorIndex++ % colors.length]  // cycle through colors
        }));

        console.log('Occupancy Distribution:----->', occupancyDistribution)
        return occupancyDistribution;
    };


    const getTopFiveOccupantsBySpace = () => {
        const areaMap = {};

        leaseData.forEach((item) => {
            const customer = item.properties["Customer Name"]?.val;
            const area = parseFloat(item.properties["Area"]?.val || "0");

            // ✅ Skip if Customer Name is missing or undefined
            if (!customer) return;

            if (!areaMap[customer]) {
                areaMap[customer] = 0;
            }

            areaMap[customer] += area;
        });

        const topOccupants = Object.entries(areaMap)
            .sort((a, b) => b[1] - a[1]) // Sort by total area descending
            .slice(0, 5) // Take top 5
            .map(([company, space]) => ({
                company,
                space: parseFloat(space.toFixed(2)),
            }));

        console.log('Top five occupents :----->', topOccupants)
        return topOccupants;
    }

    const getLeasesExpiring = () => {
        const oneDay = 86400000;

        const nowDate = new Date();
        nowDate.setHours(0, 0, 0, 0); // normalize to midnight
        const nowEpoch = nowDate.getTime();

        let result = {
            '<30 days': 0,
            '31-60 days': 0,
            '61-90 days': 0,
        };
        let totalLoss = {
            '<30 days': 0,
            '31-60 days': 0,
            '61-90 days': 0,
        };

        // const diffDays = Math.round((agreementEnd.epoch - now) / oneDay);

        leaseData.forEach(item => {
            const agreementEnd = item.properties["Agreement End Date"];
            const rentalCount = item.properties["Rental Charges"].val || 0;
            // console.log('data :----', agreementEnd)
            if (!agreementEnd?.val || !agreementEnd?.epoch) return
            console.log('epoch value :----->', agreementEnd?.epoch)
            console.log('now date :----->', nowEpoch)
            const agreementDate = new Date(agreementEnd.epoch);
            agreementDate.setHours(0, 0, 0, 0); // also normalize
            const agreementEpoch = agreementDate.getTime();
            const diffDays = Math.round((agreementEpoch - nowEpoch) / oneDay);
            console.log('day difference :----->', diffDays)

            if (diffDays >= 0 && diffDays < 30) {
                result['<30 days'] += 1;
                totalLoss['<30 days'] += Number(rentalCount)
            } else if (diffDays > 30 && diffDays <= 60) {
                result['31-60 days'] += 1;
                totalLoss['31-60 days'] += Number(rentalCount)
            } else if (diffDays > 60 && diffDays <= 90) {
                result['61-90 days'] += 1;
                totalLoss['61-90 days'] += Number(rentalCount)
            }
        });

        const leasesExpiring = [
            { id: '<30 days', value: result['<30 days'], count: totalLoss['<30 days'], color: '#fadb14' },
            { id: '31-60 days', value: result['31-60 days'], count: totalLoss['31-60 days'], color: '#36cfc9' },
            { id: '61-90 days', value: result['61-90 days'], count: totalLoss['61-90 days'], color: '#b37feb' },
        ];

        console.log('final lease expire :--->>>', leasesExpiring)
        return leasesExpiring;
    };

    function consumptionChartData() {
        const energyByMonth = {};
        const waterByMonth = {};

        waterEnergyMeter.forEach(entry => {
            const props = entry.properties || {};
            const dateStr = props.Date?.val;

            if (!dateStr) return;

            const month = moment(dateStr, "MM/DD/YYYY").format("MMMM");

            const energy = parseFloat(props.Energy_kWh?.val || 0);
            const water = parseFloat(props.Water_Liters?.val || 0);

            energyByMonth[month] = (energyByMonth[month] || 0) + energy;
            waterByMonth[month] = (waterByMonth[month] || 0) + water;
        });

        const monthOrder = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const energyData = monthOrder
            .filter(month => energyByMonth[month])
            .map(month => ({
                x: month,
                y: Math.round(energyByMonth[month])
            }));

        const waterData = monthOrder
            .filter(month => waterByMonth[month])
            .map(month => ({
                x: month,
                y: Math.round(waterByMonth[month])
            }));

        return { energyData, waterData };
    }

    const onFloorChange = async (value) => {
        const filterByLevel = totalLeaseData.filter(
            (data) => data?.properties?.["Floor"]?.val === value
        );
        console.log("filterByCustomer: ---->", filterByLevel);
        setleaseData(filterByLevel)
    };

    const onCustomerChange = async (value) => {
        const filterByCustomer = totalWaterEnergyMeter.filter(
            (data) => data?.properties?.["Customer Name"]?.val === value
        );

        console.log("filterByCustomer: ---->", filterByCustomer);
        setWaterEnergyMeter(filterByCustomer)
    };

    return (
        <div className="lease-container">
            <div className="lease-header">
                <h2>Lease Dashboard</h2>
                <div className="lease-filters">
                    <select name="building" className='filter-select' defaultValue="CUP">
                        <option value="" disabled>Choose Building</option>
                        {buildingName?.map((level, index) => (
                            <option key={index} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                    <select
                        className="filter-select"
                        name="floor"
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedFloor(value);
                            onFloorChange(value);
                        }}
                        value={selectedFloor}
                    >
                        <option value="" disabled>Choose Floor</option>
                        {levelsName?.map((level, index) => (
                            <option key={index} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                    {/* <button className="create-space-btn">Create Space</button> */}
                </div>
            </div>

            <div className="lease-stats">
                {leaseStatData.map((stat, index) => (
                    <div key={index} className={`lease-stat-box fa-solid fa-house-circle-check`}>
                        <i className="fa-solid fa-house-circle-check"></i>
                        <div className='lease-stat-box-text-value'>
                            <p>{stat.label}</p>
                            <h3>{stat.value}</h3>
                        </div>

                    </div>
                ))}
            </div>

            <div className="lease-charts">
                <div className="lease-chart-box">
                    <h4>Occupancies distribution by category (%)</h4>
                    <div className="chart-container">
                        <PieChart data={occupancyDistribution} />
                    </div>
                </div>

                <div className="lease-chart-box">
                    <h4>Top 5 occupants by space usage</h4>
                    <div className="chart-container">
                        <TopOccupantsBarChart data={topFiveOccupentbySpace} />
                    </div>
                    {/* <p className="view-more">View More</p> */}
                </div>

                <div className="lease-chart-box">
                    <h4>Lease Expiry Meter</h4>
                    <div className="chart-container">
                        <LeasesExpiringChart data={leaseExpire} />
                    </div>
                    <div style={{width: '100%', display:'flex'}}>
                        <div style={{width:'45%'}}>
                    <p>Total properties: <span className='lease-expire-total'>{leaseExpire.reduce((sum, item) => sum + item.value, 0)}</span></p>
                    <ul>
                        {leaseExpire.map((item, idx) => (
                            //   <li key={item.id}>{item.id}: {item.value}</li>
                            <div key={idx} className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                                {item.id}: {item.value}
                            </div>
                        ))}
                    </ul>
                        </div>
                        <div style={{width:'55%'}}>
                            <p>3-month Projected Loss: <span className='lease-expire-total'>₹{(leaseExpire.reduce((sum, item) => sum + item.count, 0)).toLocaleString()}</span></p>
                            <ul>
                        {leaseExpire.map((item, idx) => (
                            //   <li key={item.id}>{item.id}: {item.value}</li>
                            <div key={idx} className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                                {item.id}: ₹{item.count}
                            </div>
                        ))}
                    </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lease-charts meter-charts">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>Energy & Water Consumption</h4>
                    {/* <select className='filter-select' value={selectedEntity} onChange={(e) => setSelectedEntity(e.target.value)}>
                        <option value="Emirates">Emirates</option>
                        
                    </select> */}

                    <select
                        className="filter-select"
                        name="floor"
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedCustomer(value);
                            onCustomerChange(value);
                        }}
                        value={selectedCustomer}
                    >
                        <option value="" disabled>Choose Customer</option>
                        {uniqueCustomers?.map((customerName, index) => (
                            <option key={index} value={customerName}>
                                {customerName}
                            </option>
                        ))}
                    </select>


                </div>

                <div className="lease-charts">
                    <LineChartCard
                        title="Energy consumption"
                        data={[{ id: 'Energy', data: energyConsumption }]}
                        color="#d32f2f"
                        unit="kW"
                    // comparisonText=" ↑ 9% higher than last month"
                    />

                    <LineChartCard
                        title="Water consumption"
                        data={[{ id: 'Water', data: waterConsumption }]}
                        color="#388e3c"
                        unit="L"
                    // comparisonText=" ↓ 11% lower than last month"
                    />
                </div>
            </div>

            {isLoading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100vh",
                        background: "rgba(255, 255, 255, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <CircularProgress size={40} />
                </div>
            )}
        </div>
    );
};

export default LeaseManagement;
