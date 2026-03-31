import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Printer, FileText, User, CreditCard, ChevronDown, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { InvoiceData, InvoiceItem, EXCHANGE_RATE } from './types';

const INITIAL_DATA: InvoiceData = {
  invoiceNo: 'INV-' + Math.floor(Math.random() * 1000000).toString().padStart(8, '0'),
  date: format(new Date(), 'dd/MM/yyyy'),
  guichet: 'N/A',
  cashier: 'OM RATANA',
  status: '(C) Organization',
  nub: 'MOHSPRH000011788',
  patientName: 'ឡុង អេង (SSB_1)',
  sex: 'Féminin',
  age: 41,
  origin: 'Cambodian Passenger',
  residence: 'ព្រះសីហនុ',
  organizationName: 'បេឡាជាតិរបបសន្តិសុខសង្គម (ប.ស.ស)',
  items: [
    {
      id: '1',
      service: 'ផ្នែកពិគ្រោះជំងឺបញ្ជូន ( ទូទៅ និងឯកទេស )',
      prestation: 'បសស ពិគ្រោះជំងឺក្រៅឯកទេស 6.00',
      priceUsd: 6.00,
      quantity: 1,
      unit: '',
    }
  ],
  amountReceivedUsd: 0,
  amountReceivedKhr: 0,
};

const SERVICES = [
  'ផ្នែកពិគ្រោះជំងឺបញ្ជូន ( ទូទៅ និងឯកទេស )',
  'ផ្នែករោគស្ត្រី',
  'ផ្នែកសម្ភព',
  'ផ្នែកសល្យសាស្ត្រ(វះកាត់តូច)',
  'សល្យាគារ និងដាក់ថ្នាំសន្លប់(វះកាត់ធំ)',
  'ផ្នែកជំងឺទូទៅ-មនុស្សចាស់',
  'ផ្នែកសង្គ្រោះបន្ទាន់',
  'ផ្នែកជំងឺកុមារ',
  'ផ្នែកចក្ខុរោគ',
  'ផ្នែកជំងឺមាត់-ធ្មេញ',
  'ផ្នែកមន្ទីរពិសោធន៍ និងផ្តល់ឈាម',
  'ផ្នែកអេកូសាស្ត្រ/ផ្នែកវិទ្យាសាស្ត្រ/ស្កែន',
  'ដឹកជញ្ជូន-រថយន្តគិលានសង្គ្រោះ',
  'សុខភាពគ្រួសារ'
];

const PRICES = ['6', '15', '40', '50', '150', '250'];

export default function App() {
  const [data, setData] = useState<InvoiceData>(() => {
    const saved = localStorage.getItem('invoice_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, amountReceivedUsd: 0, amountReceivedKhr: 0 };
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('invoice_data', JSON.stringify(data));
  }, [data]);

  const printRef = useRef<HTMLDivElement>(null);

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      service: '',
      prestation: '',
      priceUsd: 0,
      quantity: 1,
      unit: '',
    };
    setData({ ...data, items: [...data.items, newItem] });
  };

  const handleRemoveItem = (id: string) => {
    setData({ ...data, items: data.items.filter(item => item.id !== id) });
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setData({
      ...data,
      items: data.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const calculateTotalUsd = () => {
    return data.items.reduce((sum, item) => sum + (item.priceUsd * item.quantity), 0);
  };

  const totalUsd = calculateTotalUsd();
  const totalKhr = totalUsd * EXCHANGE_RATE;
  const totalReceivedUsdEquivalent = data.amountReceivedUsd + (data.amountReceivedKhr / EXCHANGE_RATE);
  const changeUsd = Math.max(0, totalReceivedUsdEquivalent - totalUsd);
  const changeKhr = changeUsd * EXCHANGE_RATE;

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data?')) {
      setData(INITIAL_DATA);
      localStorage.removeItem('invoice_data');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 overflow-y-auto max-h-[90vh] no-print"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <FileText size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Invoice Generator</h1>
                <p className="text-sm text-gray-500">Create professional Cambodian invoices</p>
              </div>
            </div>
            <button 
              onClick={handleReset}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Reset Data"
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Basic Info */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <FileText size={14} /> Invoice Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Invoice No</label>
                  <input 
                    type="text" 
                    value={data.invoiceNo}
                    onChange={e => setData({...data, invoiceNo: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Date</label>
                  <input 
                    type="text" 
                    value={data.date}
                    onChange={e => setData({...data, date: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Cashier</label>
                  <input 
                    type="text" 
                    value={data.cashier}
                    onChange={e => setData({...data, cashier: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Status</label>
                  <input 
                    type="text" 
                    value={data.status}
                    onChange={e => setData({...data, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Patient Info */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <User size={14} /> Patient Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Patient Name</label>
                  <input 
                    type="text" 
                    value={data.patientName}
                    onChange={e => setData({...data, patientName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Nub ID</label>
                  <input 
                    type="text" 
                    value={data.nub}
                    onChange={e => setData({...data, nub: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Sex</label>
                    <select 
                      value={data.sex}
                      onChange={e => setData({...data, sex: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                    >
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500">Age</label>
                    <input 
                      type="number" 
                      value={data.age}
                      onChange={e => setData({...data, age: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Residence</label>
                  <input 
                    type="text" 
                    value={data.residence}
                    onChange={e => setData({...data, residence: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">Organization Name</label>
                <select 
                  value={data.organizationName}
                  onChange={e => setData({...data, organizationName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="បេឡាជាតិរបបសន្តិសុខសង្គម (ប.ស.ស)">បេឡាជាតិរបបសន្តិសុខសង្គម (ប.ស.ស)</option>
                  <option value="ស្វ័យនិយោជន៍ (ថែទាំ)">ស្វ័យនិយោជន៍ (ថែទាំ)</option>
                </select>
              </div>
            </section>

            {/* Items */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <CreditCard size={14} /> Services & Items
                </h2>
                <button 
                  onClick={handleAddItem}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {data.items.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3 relative group"
                    >
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                          <select 
                            value={item.service}
                            onChange={e => handleUpdateItem(item.id, 'service', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 appearance-none"
                          >
                            <option value="">Select Service</option>
                            {SERVICES.map((service, idx) => (
                              <option key={idx} value={service}>{service}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                            <ChevronDown size={14} />
                          </div>
                        </div>
                        <input 
                          placeholder="Prestation"
                          value={item.prestation}
                          onChange={e => handleUpdateItem(item.id, 'prestation', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Price ($)</label>
                          <div className="relative">
                            <select 
                              value={item.priceUsd}
                              onChange={e => handleUpdateItem(item.id, 'priceUsd', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 appearance-none"
                            >
                              <option value="0">Select Price</option>
                              {PRICES.map((price, idx) => (
                                <option key={idx} value={price}>{price}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                              <ChevronDown size={12} />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Qty</label>
                          <input 
                            type="number"
                            value={item.quantity}
                            onChange={e => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400">Unit</label>
                          <input 
                            placeholder="e.g. 1"
                            value={item.unit}
                            onChange={e => handleUpdateItem(item.id, 'unit', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* Payment */}
            <section className="space-y-4 opacity-50 pointer-events-none">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <CreditCard size={14} /> Payment Received (Disabled)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Received ($)</label>
                  <input 
                    type="number" 
                    disabled
                    value={0}
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl outline-none cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Received (៛)</label>
                  <input 
                    type="number" 
                    disabled
                    value={0}
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={handlePrint}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                <Printer size={20} /> Print Invoice
              </button>
            </div>

            <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
              <div className="flex gap-3 text-blue-700">
                <ExternalLink size={20} className="shrink-0" />
                <h3 className="font-bold text-sm">បញ្ជាក់ពីការបោះពុម្ព (Printing Note)</h3>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                ដោយសារកម្មវិធីនេះកំពុងដំណើរការក្នុងផ្ទាំង Preview ប៊ូតុង <strong>Print</strong> អាចនឹងមិនដំណើរការលើកម្មវិធីរុករក (Browser) មួយចំនួន។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីបើកក្នុងផ្ទាំងថ្មី រួចបោះពុម្ពម្តងទៀត៖
              </p>
              <button 
                onClick={() => window.open(window.location.href, '_blank')}
                className="w-full py-2.5 bg-white border border-blue-300 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink size={14} /> បើកក្នុងផ្ទាំងថ្មី (Open in New Tab)
              </button>
            </div>
          </div>
        </motion.div>

        {/* Preview Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 md:p-8 overflow-y-auto max-h-[90vh] print:p-0 print:shadow-none print:border-none print:max-h-none"
        >
          <div ref={printRef} className="invoice-paper bg-white text-black font-kantumruy text-[11px] leading-tight mx-auto w-[148mm] min-h-[210mm] print:h-[200mm] p-[10mm] print:p-[8mm] print:m-0 flex flex-col justify-between break-inside-avoid print:overflow-hidden scale-[0.95] origin-top">
            <div>
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-[12px] font-khmer-m1 mb-0.5">ព្រះរាជាណាចក្រកម្ពុជា</h3>
                <h3 className="text-[12px] font-khmer-m1 mb-4">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
                <h1 className="text-[16px] font-bold mb-1">វិក្កយបត្រ</h1>
                <h2 className="text-[12px] font-bold underline">FACTURE</h2>
              </div>

              {/* Info Grid */}
              <div className="flex justify-between mb-6">
                <div className="space-y-1">
                  <div className="flex">
                    <span className="w-20">Nub</span>
                    <span>: {data.nub}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20">Patient</span>
                    <span className="font-bold">: {data.patientName}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20">Sexe, Age</span>
                    <span>: {data.sex}, {data.age} ans</span>
                  </div>
                  <div className="flex">
                    <span className="w-20">Origine</span>
                    <span>: {data.origin}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20">Residence</span>
                    <span>: {data.residence}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex">
                    <span className="w-20">Facture N°</span>
                    <span className="font-bold">: {data.invoiceNo}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20">Date</span>
                    <span>: {data.date}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20">Guichet</span>
                    <span>: {data.guichet}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20">Cashier</span>
                    <span className="font-bold">: {data.cashier}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20">Statut</span>
                    <span>: {data.status}</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <table className="w-full border-collapse border border-black mb-4 text-[8px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-black p-0.5 font-bold text-center w-[30%]">Service</th>
                    <th className="border border-black p-0.5 font-bold text-center w-[30%]">Prestation</th>
                    <th className="border border-black p-0.5 font-bold text-center w-[10%]">PU($US)</th>
                    <th className="border border-black p-0.5 font-bold text-center w-[5%]">Qté</th>
                    <th className="border border-black p-0.5 font-bold text-center w-[5%]">Unité</th>
                    <th className="border border-black p-0.5 font-bold text-center w-[10%]">Prix ($US)</th>
                    <th className="border border-black p-0.5 font-bold text-center w-[10%]">Prix (Riels)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-black p-0.5">{item.service}</td>
                      <td className="border border-black p-0.5">{item.prestation}</td>
                      <td className="border border-black p-0.5 text-right">{item.priceUsd.toFixed(2)}</td>
                      <td className="border border-black p-0.5 text-center">{item.quantity}</td>
                      <td className="border border-black p-0.5 text-center">{item.unit}</td>
                      <td className="border border-black p-0.5 text-right">{(item.priceUsd * item.quantity).toFixed(2)}</td>
                      <td className="border border-black p-0.5 text-right">{(item.priceUsd * item.quantity * EXCHANGE_RATE).toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={5} className="border border-black p-0.5 text-right uppercase">Total</td>
                    <td className="border border-black p-0.5 text-right">{totalUsd.toFixed(2)}</td>
                    <td className="border border-black p-0.5 text-right">{totalKhr.toLocaleString()}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={5} className="border border-black p-0.5 text-right uppercase">Total Paid</td>
                    <td className="border border-black p-0.5 text-right">{totalUsd.toFixed(2)}</td>
                    <td className="border border-black p-0.5 text-right">{totalKhr.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="-mt-52">
              {/* Footer Calculation */}
              <div className="flex justify-end mb-2 text-[10px]">
                <div className="w-64 border border-black">
                  <div className="flex border-b border-black">
                    <div className="flex-1 p-0.5 font-bold uppercase border-r border-black">Montant Recu</div>
                    <div className="w-20 p-0.5 text-right border-r border-black">$US {data.amountReceivedUsd.toFixed(2)}</div>
                    <div className="w-20 p-0.5 text-right">R {data.amountReceivedKhr.toLocaleString()}</div>
                  </div>
                  <div className="flex">
                    <div className="flex-1 p-0.5 font-bold uppercase border-r border-black">Montant Rendu</div>
                    <div className="w-20 p-0.5 text-right border-r border-black">$US {changeUsd.toFixed(2)}</div>
                    <div className="w-20 p-0.5 text-right">R {changeKhr.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="text-right font-bold italic mb-4">
                {data.organizationName}
              </div>

              <div className="flex justify-between items-end">
                <div className="text-center">
                  <p className="font-bold mb-1">អ្នកទទួលប្រាក់</p>
                  <p className="text-[10px]">Agent de recette</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          .no-print { display: none !important; }
          .invoice-paper { margin: 0 !important; box-shadow: none !important; border: none !important; width: 100% !important; height: 100% !important; break-inside: avoid !important; }
          @page { size: A5; margin: 0; }
        }
        .invoice-paper {
          position: relative;
          box-shadow: 0 0 20px rgba(0,0,0,0.05);
          border: 1px solid #eee;
          /* Force standard colors for html2canvas compatibility */
          color: #000000 !important;
          background-color: #ffffff !important;
          font-family: "Kantumruy Pro", sans-serif !important;
        }
        .font-khmer-m1 {
          font-family: "Moul", serif !important;
        }
        .font-kantumruy {
          font-family: "Kantumruy Pro", sans-serif !important;
        }
        .invoice-paper * {
          border-color: #000000 !important;
        }
        .invoice-paper .bg-gray-50 {
          background-color: #f9fafb !important;
        }
      `}} />
    </div>
  );
}
