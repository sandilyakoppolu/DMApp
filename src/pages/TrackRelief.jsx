import { useEffect, useState } from "react";
import { API } from "../api";

export default function TrackRelief(){
  const [incidents, setIncidents] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [sel, setSel] = useState("");
  const [form, setForm] = useState({ description:"", foodKits:0, medicalKits:0, peopleHelped:0, });

  const load = async () => {
    setIncidents(await API.listIncidents());
    setUpdates(await API.listRelief());
  };
  useEffect(()=>{ load(); },[]);

  const addUpdate = async (e) => {
    e.preventDefault();
    if(!sel) return alert("Select an incident");
    await API.addRelief(sel, form);
    setForm({ description:"", foodKits:0, medicalKits:0, peopleHelped:0 });
    await load();
  };

  return (
    <div className="container">
      <h2>Track Relief</h2>
      <div className="card">
        <div className="grid" style={{gridTemplateColumns:"2fr 1fr", gap:16}}>
          <form onSubmit={addUpdate}>
            <select value={sel} onChange={e=>setSel(e.target.value)}>
              <option value="">Select Incident</option>
              {incidents.map(i=> <option key={i.id} value={i.id}>{i.title} — {i.type}</option>)}
            </select>
            <textarea rows="3" className="input" placeholder="Update details" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            <div className="grid" style={{gridTemplateColumns:"repeat(3,1fr)", gap:12}}>
              <input className="input" type="number" placeholder="Food kits" value={form.foodKits} onChange={e=>setForm({...form,foodKits:Number(e.target.value)})}/>
              <input className="input" type="number" placeholder="Medical kits" value={form.medicalKits} onChange={e=>setForm({...form,medicalKits:Number(e.target.value)})}/>
              <input className="input" type="number" placeholder="People helped" value={form.peopleHelped} onChange={e=>setForm({...form,peopleHelped:Number(e.target.value)})}/>
            </div>
            <button className="btn">Add Update</button>
          </form>

          <div>
            <div className="card">
              <h4>Incidents</h4>
              <ul className="small">
                {incidents.map(i=> <li key={i.id}>{i.title} — <b>{i.status}</b></li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h3 style={{marginTop:24}}>Recent Relief Updates</h3>
      <table className="table card">
        <thead><tr><th>Incident</th><th>Update</th><th>Food</th><th>Medical</th><th>People</th><th>Time</th></tr></thead>
        <tbody>
        {updates.map(u=>(
          <tr key={u.id}>
            <td>{u.incident?.title || u.incidentId}</td>
            <td>{u.description}</td>
            <td>{u.foodKits||0}</td>
            <td>{u.medicalKits||0}</td>
            <td>{u.peopleHelped||0}</td>
            <td className="small">{new Date(u.updatedAt).toLocaleString()}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
