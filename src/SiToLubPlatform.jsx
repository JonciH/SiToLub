import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

export default function SiToLubPlatform() {
  const [prompt, setPrompt] = useState(
    "Dear SiToLub-AI, I want to substituted chlorinated paraffins and want to be certified by EcoLabel. Can you propose me an alternative"
  );
  const [smiles, setSmiles] = useState("");
  const [scope, setScope] = useState("component");
  const [ttl, setTtl] = useState("");
  const [sustainabilityScope, setSustainabilityScope] = useState("cradle-to-gate");
  const [impactCategories, setImpactCategories] = useState([]);
  const [socialLcaCategories, setSocialLcaCategories] = useState([]);
  const [lcaResults, setLcaResults] = useState([]);

  const fetchMockLcaResults = async () => {
    const randomLogDist = () => Math.round(Math.exp(Math.random() * 3));
    const newData = Array.from({ length: 10 }, (_, i) => {
      const x = i * 50 + 50;
      return {
        category: `${x}`,
        Base: randomLogDist(),
        SSbD: randomLogDist(),
      };
    });
    setLcaResults(newData);
  };

  const lciaImpactCategories = [
    "Climate change", "Ozone depletion", "Human toxicity, non-cancer", "Human toxicity, cancer", "Particulate matter",
    "Ionising radiation", "Photochemical ozone formation", "Acidification", "Eutrophication, terrestrial",
    "Eutrophication, freshwater", "Eutrophication, marine", "Ecotoxicity, freshwater", "Land use", "Water use",
    "Resource use, fossils", "Resource use, minerals and metals"
  ];

  const sLcaCategories = [
    "Health and safety", "Fair salary", "Working hours", "Freedom of association", "Discrimination", "Forced labor",
    "Child labor", "Social benefit/social security", "Social dialogue", "Community engagement", "Cultural heritage",
    "Respect of indigenous rights", "Access to material resources", "Access to immaterial resources",
    "Safe and healthy living conditions", "Respect of laws and regulations", "Corruption", "Fair competition",
    "Promoting social responsibility", "Supplier relationships"
  ];

  const toggleImpactCategory = (category) => {
    setImpactCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleSocialLcaCategory = (category) => {
    setSocialLcaCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const ttlOptions = ["ALL", "MWF", "EP", "AW", "CL", "OF"];

  const renderParameterInput = (param) => (
    <div key={param} className="flex items-center gap-2 mb-2">
      <label className="w-64 capitalize">{param.replace(/_/g, ' ')}</label>
      <Input placeholder={`Enter value for ${param}`} className="flex-1" />
      <Button>Predict from SMILES</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e6f2ef] text-[#204036] p-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">SiToLub Plattform</h1>

        <div className="mb-6 space-y-4">
          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full" />
          <Input placeholder="Enter SMILES code" value={smiles} onChange={(e) => setSmiles(e.target.value)} />
          <div className="flex items-center gap-6">
            <label className="flex items-center space-x-2">
              <input type="radio" name="scope" value="component" checked={scope === "component"} onChange={(e) => setScope(e.target.value)} />
              <span>Component Level</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="scope" value="formulated" checked={scope === "formulated"} onChange={(e) => setScope(e.target.value)} />
              <span>Fully Formulated</span>
            </label>
            {scope === "formulated" && (
              <div className="flex flex-wrap gap-4">
                {ttlOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input type="radio" name="ttl" value={option} checked={ttl === option} onChange={(e) => setTtl(e.target.value)} />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="toxicity" className="w-full">
          <TabsList className="grid grid-cols-4 bg-[#b4d9cd] rounded-xl mb-4">
            <TabsTrigger value="toxicity">Toxicity</TabsTrigger>
            <TabsTrigger value="functionality">Functionality</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
            <TabsTrigger value="ssbd">SSbD Work Flow</TabsTrigger>
          </TabsList>

          <TabsContent value="ssbd">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">SSbD Design Criteria</h2>
                <ul className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <input type="radio" name={`ssbd${i}`} />
                      <span>
                        SSbD {i + 1} - {[
                          "Material efficiency",
                          "Minimise hazardous chemicals or materials",
                          "Design for energy efficiency",
                          "Use renewable sources",
                          "Prevent and avoid hazardous emissions",
                          "Reduce exposure to hazardous substances",
                          "Design for the end-of-life",
                          "Consider the whole life cycle"
                        ][i]}
                      </span>
                    </li>
                  ))}
                </ul>
                <h2 className="text-lg font-semibold mt-6">Weighting Criteria (Total = 100%)</h2>
                {"Toxicity, Environmental LCA, Performance, Social LCA".split(", ").map(label => (
                  <div key={label} className="mb-2">
                    <label>{label}</label>
                    <Slider defaultValue={[25]} max={100} step={1} />
                  </div>
                ))}
                <Button className="mt-4">Run SSbD Assessment</Button>
                <div className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Toxicity Parameters</h2>
                  {[
                    "logKow", "Persistency", "Biodegradability", "Acute toxicity", "Chronic toxicity", "Endocrine disruption potential"
                  ].map(renderParameterInput)}

                  <h2 className="text-xl font-semibold mt-6 mb-4">Functionality Parameters</h2>
                  {[
                    "Viscosity", "Power loss", "Lubricity", "Thermal stability", "Oxidation resistance"
                  ].map(renderParameterInput)}

                  <h2 className="text-xl font-semibold mt-6">Sustainability</h2>
                  <Input placeholder="Enter CAS or SMILES" />
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <Button onClick={fetchMockLcaResults}>Assess environmental LCA</Button>
                    <Button variant="secondary">Assess social LCA</Button>
                    <Button variant="outline">Assess holistic sustainability</Button>
                  </div>
                  <div className="flex gap-4">
                    <label>
                      <input type="radio" name="sustScope" value="cradle-to-gate" checked={sustainabilityScope === "cradle-to-gate"} onChange={(e) => setSustainabilityScope(e.target.value)} /> Cradle-to-Gate
                    </label>
                    <label>
                      <input type="radio" name="sustScope" value="cradle-to-grave" checked={sustainabilityScope === "cradle-to-grave"} onChange={(e) => setSustainabilityScope(e.target.value)} /> Cradle-to-Grave
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {lciaImpactCategories.map((cat) => (
                      <label key={cat}>
                        <input type="checkbox" checked={impactCategories.includes(cat)} onChange={() => toggleImpactCategory(cat)} /> {cat}
                      </label>
                    ))}
                  </div>
                  <h2 className="text-lg font-semibold mt-4">Social LCA Categories</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {sLcaCategories.map((cat) => (
                      <label key={cat}>
                        <input type="checkbox" checked={socialLcaCategories.includes(cat)} onChange={() => toggleSocialLcaCategory(cat)} /> {cat}
                      </label>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold mt-6">Results</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={lcaResults} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" label={{ value: 'GWP', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Base" fill="#8884d8" />
                      <Bar dataKey="SSbD" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="toxicity">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4">Toxicity Parameters</h2>
                {["logKow", "Persistency", "Biodegradability", "Acute toxicity", "Chronic toxicity", "Endocrine disruption potential"].map(renderParameterInput)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="functionality">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-4">Functionality Parameters</h2>
                {["Viscosity", "Power loss", "Lubricity", "Thermal stability", "Oxidation resistance"].map(renderParameterInput)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sustainability">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h2 className="text-xl font-semibold">Sustainability</h2>
                {/* (Retained independently in case user wants to see separate tab view) */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
