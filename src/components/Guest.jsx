'use client';

import { Fragment, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Dialog, Transition } from '@headlessui/react';
import { HomeModernIcon } from "@heroicons/react/20/solid";
import axios from 'axios';

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY
const API_URL = import.meta.env.VITE_STRAPI_API_URL

export default function Guest() {
    const [theEvents, setTheEvents] = useState([])
    const [allSeasonals, setAllSeasonals] = useState([])
    const [allDefaults, setAllDefaults] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [toShow, setToShow] = useState(null)

    useEffect(() => {
        axios.get(`${API_URL}/reservations`,{
            headers:{
                "Content-type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            }
        })
        .then(response => {
            const formattedEvents = response.data.data.map(event => ({
                title: '',
                start: event.attributes.start,
                end: event.attributes.end,
                allDay: event.attributes.allDay,
                villas: event.attributes.villas,
                id: event.id,
                display: 'background'
            }))

            handleGuestEvents(formattedEvents);
        })
        .catch(error => {
            console.error('There was an error', error)
        })

        axios.get(`${API_URL}/seasonal-pricings`, {
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            }
        })
        .then(response => {
            console.log('Fetched Seasonal Pricing:', response.data.data);

            const formattedSeasonals = response.data.data.map(e => ({
            startDate: e.attributes.start,
            endDate: e.attributes.end,
            seasonalPricing: e.attributes.pricing,
            }));
    
            setAllSeasonals(formattedSeasonals);
            
        })
        .catch(error => {
            console.error('There was an error fetching the seasonals', error);
        }); 

        axios.get(`${API_URL}/default-pricings`, {
            headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
            }
        })
        .then(response => {
            console.log('Fetched Default Pricing:', response.data.data);

            const formattedDefaults = response.data.data.map(e => ({
            pricing: e.attributes.pricing,
            }));

            setAllDefaults(formattedDefaults);
            
        })
        .catch(error => {
            console.error('There was an error fetching the seasonals', error);
        }); 
    }, [])

    const handleGuestEvents = (events) => {
        const dailyEvents = events.flatMap((event) => {
            const { start, end, villas } = event;
            const startDate = new Date(start);
            const endDate = new Date(end);
            const days = [];

            for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
                const dayEvent = {
                    title: '',
                    start: new Date(date).toISOString().slice(0, 10),
                    end: new Date(date).toISOString().slice(0, 10),
                    allDay: true,
                    villas,
                    id: `${event.id}-${date.toISOString().slice(0, 10)}`,
                    display: 'background',
                };
                days.push(dayEvent);
            }

            return days;
        });

        const mergedEvents = dailyEvents.reduce((acc, event) => {
            const existingEvent = acc.find(e => e.start === event.start);
            if (existingEvent) {
                existingEvent.villas += event.villas;
            } else {
                acc.push(event);
            }
            return acc;
        }, []);

        mergedEvents.forEach(event => {
            let bgc;
            if (event.villas === 1) {
                bgc = '#59a321';
            } else if (event.villas === 2) {
                bgc = '#f58318';
            } else {
                bgc = '#962921';
            }
            event.backgroundColor = bgc;
          });

        setTheEvents(mergedEvents);
    };

    const findRecordbyDate = (date) => {
        return theEvents.find(event => event.start === date)
    }

    function handleShowEvent(data) {
        console.log(data)
        setShowModal(true);
        const record = findRecordbyDate(data.dateStr);
        console.log(record);

        let updatedRecord = null;
        const date = new Date(data.dateStr);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };


        // Find seasonal pricing for the selected date
        const seasonalPricing = allSeasonals.find(seasonal => {
            const seasonalStart = new Date(seasonal.startDate);
            const seasonalEnd = new Date(seasonal.endDate);
            return (seasonalStart <= date && seasonalEnd >= date);
        });

        // Set pricing based on seasonal pricing or default pricing
        let pricing = null;
        if (seasonalPricing) {
            pricing = seasonalPricing.seasonalPricing;
        } else {
            // If no seasonal pricing found, get the last default pricing
            if (allDefaults.length > 0) {
                pricing = allDefaults[allDefaults.length - 1].pricing;
            } else {
                pricing = 0; // Default to 0 if no pricing is available
            }
        }

        if (record) {
            updatedRecord = { ...record };
            if (updatedRecord.villas === 1) {
                updatedRecord.title = 'Two villas available.';
                updatedRecord.start = date.toLocaleDateString('en-us', options);
                updatedRecord.pricing = pricing;
            } else if (updatedRecord.villas === 2) {
                updatedRecord.title = 'One villa available.';
                updatedRecord.start = date.toLocaleDateString('en-us', options);
                updatedRecord.pricing = pricing;
            } else {
                updatedRecord.title = 'No villa available.';
                updatedRecord.start = date.toLocaleDateString('en-us', options);
                updatedRecord.pricing = pricing;
            }
        } else {
            updatedRecord = {
                title: 'Three villas available.',
                start: date.toLocaleDateString('en-us', options),
                villas: 0,
                allDay: true,
                pricing: pricing,
            };
        }
    
        setToShow(updatedRecord);
    }
    function handleCloseModal() {
        setShowModal(false);
    }

    return (
        <>
            <main>
                <div className="mx-12 px-24 py-8 grid grid-cols-10 h-screen">
                    <div className="col-span-10">
                        <FullCalendar
                            plugins={[
                                dayGridPlugin,
                                interactionPlugin,
                                timeGridPlugin
                            ]}
                            headerToolbar={{
                                left: 'prev,next',
                                center: 'title',
                                right: 'today'
                            }}
                            events={theEvents}
                            nowIndicator={true}
                            editable={true}
                            droppable={true}
                            selectable={true}
                            selectMirror={true}
                            fixedWeekCount={false}
                            dateClick={handleShowEvent}
                        />
                    </div>
                </div>
                    <Transition.Root show={showModal} as={Fragment}>
                        <Dialog as="div" className="relative z-10" onClose={setShowModal}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            </Transition.Child>
                            <div className="fixed inset-0 z-10 overflow-y-auto">
                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        >
                                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-max sm:p-6">
                                            <div>
                                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                                    <HomeModernIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                                </div>
                                                <div className="mt-3 text-center sm:mt-5">
                                                    <Dialog.Title as="h3" className="mb-8 text-lg font-bold font-alata leading-6 text-gray-900">
                                                        View Availability.
                                                    </Dialog.Title>
                                                    <div className="w-96 text-left flex flex-col items-center">
                                                        <span className="font-alata text-3xl">{toShow && toShow.title}</span>
                                                        <span className="font-bold font-alata text-lg py-2">{toShow && toShow.start}</span>
                                                        <span className=" font-alata text-lg py-2">Each Villa @ Ksh.{toShow && toShow.pricing}.00</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-8 flex gap-8 w-full">
                                                <button type="button" className="grow mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 font-semibold 
                                                shadow-sm ring-1 ring-inset ring-green-600 hover:bg-green-100 sm:mt-0 sm:w-auto"
                                                    onClick={handleCloseModal}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
            </main>
        </>
    );
}