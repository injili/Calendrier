"use client";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from "@fullcalendar/timegrid";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ExclamationTriangleIcon, HomeModernIcon } from "@heroicons/react/20/solid";



export default function Calendar() {
    const [allEvents, setAllEvents] = useState([]);
    const [allSeasonals, setAllSeasonals] = useState([]);
    const [allDefaults, setAllDefaults] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [toShow, setToShow] = useState(null)
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertSeasonal, setShowAlertSeasonal] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null)
    const [newDefault, setNewDefault] = useState({
      pricing: 1
    })
    const [newSeasonal, setNewSeasonal] = useState({
      startDate: '',
      endDate: '',
      seasonalPricing: 1,
    })
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: '',
        end: '',
        phone: '',
        villas: 1,
        allDay: true,
        backgroundColor: '',
        id: 0
    })

    const displayAlert = (v) => {
      if (v === 1) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 10000); // Hide the alert after 10 seconds
      } else {
        setShowAlertSeasonal(true);
        setTimeout(() => {
          setShowAlertSeasonal(false);
        }, 10000); // Hide the alert after 10 seconds
      }
      
    };

    useEffect(() => {
      axios.get('http://localhost:1337/api/reservations', {
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer 44f2a2de5c0dfa1243b0e811b0cf485ff07e98213a729ef317411facbd0c9d3b5d6beec68e03944ff90da6dfcbd049d9ab5bab81aa6430e2a13f97617967b75e850a7035903f6b980e9b505505a5e6b4c1b0d741196b35d11fcd8afc6f671f6506b75ebc900ce7a337ffe7f5396972384e41eabad8990510df4cb28f3a52cb02"
        }
      })
      .then(response => {
        console.log('Fetched events:', response.data.data);

        const formattedEvents = response.data.data.map(event => ({
          title: event.attributes.title,
          start: event.attributes.start,
          end: event.attributes.end,
          phone: event.attributes.phone,
          villas: event.attributes.villas,
          allDay: event.attributes.allDay,
          id: event.id
        }));
  
        formattedEvents.forEach(event => {
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

        setAllEvents(formattedEvents);
        
      })
      .catch(error => {
        console.error('There was an error fetching the events', error);
      });

      axios.get('http://localhost:1337/api/seasonal-pricings', {
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer 44f2a2de5c0dfa1243b0e811b0cf485ff07e98213a729ef317411facbd0c9d3b5d6beec68e03944ff90da6dfcbd049d9ab5bab81aa6430e2a13f97617967b75e850a7035903f6b980e9b505505a5e6b4c1b0d741196b35d11fcd8afc6f671f6506b75ebc900ce7a337ffe7f5396972384e41eabad8990510df4cb28f3a52cb02"
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

      axios.get('http://localhost:1337/api/default-pricings', {
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer 44f2a2de5c0dfa1243b0e811b0cf485ff07e98213a729ef317411facbd0c9d3b5d6beec68e03944ff90da6dfcbd049d9ab5bab81aa6430e2a13f97617967b75e850a7035903f6b980e9b505505a5e6b4c1b0d741196b35d11fcd8afc6f671f6506b75ebc900ce7a337ffe7f5396972384e41eabad8990510df4cb28f3a52cb02"
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

    const handleChange = (e) => {
      const { name, value } = e.target;
      console.log(`Changing value for ${name} to ${value}`)
        setNewEvent(prevEvent => ({
            ...prevEvent,
            [name]: value
        }))
    }

    const handleDefaultChange = (e) => {
      const { name, value } = e.target;
      console.log(`Changing value for ${name} to ${value}`)
        setNewDefault(prevEvent => ({
            ...prevEvent,
            [name]: value
        }))
    }

    const handleSeasonalChange = (e) => {
      const { name, value } = e.target;
      console.log(`Changing value for ${name} to ${value}`)
      setNewSeasonal(prevEvent => ({
          ...prevEvent,
          [name]: value
      }))
    }

    function handleSubmit(e) {
      e.preventDefault();
      const eventToCreate = {
        data:{
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end,
          phone: newEvent.phone,
          villas: newEvent.villas,
          allDay: newEvent.allDay,
        }
      };

      let bgc;
      if (newEvent.villas === 1) {
        bgc = '#59a321';
      } else if (newEvent.villas === 2) {
        bgc = '#76911c';
      } else {
        bgc = '#962921';
      }

      const updatedNewEvent = {
          ...newEvent,
          backgroundColor: bgc,
      };

      
      setAllEvents(prevEvents => {
        const updatedEvents = [...prevEvents, updatedNewEvent];
        console.log("Updated Events:", updatedEvents);
        return updatedEvents;
      });

      axios.post('http://localhost:1337/api/reservations', eventToCreate,
        {
          headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer 44f2a2de5c0dfa1243b0e811b0cf485ff07e98213a729ef317411facbd0c9d3b5d6beec68e03944ff90da6dfcbd049d9ab5bab81aa6430e2a13f97617967b75e850a7035903f6b980e9b505505a5e6b4c1b0d741196b35d11fcd8afc6f671f6506b75ebc900ce7a337ffe7f5396972384e41eabad8990510df4cb28f3a52cb02"
          },
        })
      .then(response => {
        setShowModal(false);
        setNewEvent({
          title: '',
          start: '',
          end: '',
          phone: '',
          villas: '',
          allDay: true,
          id: 0
        })
      })
      .catch(error => {
        console.error('There was an error submitting event!', error);
      });
    }

    function submitDefault(e) {
      e.preventDefault();
      if (newDefault.pricing > 100) {
        const defaultNew = {
          data: {
            pricing: newDefault.pricing,
          }
        };

        axios.post('http://localhost:1337/api/default-pricings', defaultNew,
          {
            headers: {
              "Content-type": "application/json",
              "Authorization": "Bearer 44f2a2de5c0dfa1243b0e811b0cf485ff07e98213a729ef317411facbd0c9d3b5d6beec68e03944ff90da6dfcbd049d9ab5bab81aa6430e2a13f97617967b75e850a7035903f6b980e9b505505a5e6b4c1b0d741196b35d11fcd8afc6f671f6506b75ebc900ce7a337ffe7f5396972384e41eabad8990510df4cb28f3a52cb02"
            },
          })
        .then(response => {
          setNewDefault({
            pricing: 1,
          });
          displayAlert(1);
        })
        .catch(error => {
          console.error('There was an error submitting default!', error);
        });

      }
      
    }

    function submitSeasonal(e) {
      e.preventDefault();
      const seasonalNew = {
        data: {
          start: newSeasonal.startDate,
          end: newSeasonal.endDate,
          pricing: newSeasonal.seasonalPricing,
        }
      };

      axios.post('http://localhost:1337/api/seasonal-pricings', seasonalNew,
        {
          headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer 44f2a2de5c0dfa1243b0e811b0cf485ff07e98213a729ef317411facbd0c9d3b5d6beec68e03944ff90da6dfcbd049d9ab5bab81aa6430e2a13f97617967b75e850a7035903f6b980e9b505505a5e6b4c1b0d741196b35d11fcd8afc6f671f6506b75ebc900ce7a337ffe7f5396972384e41eabad8990510df4cb28f3a52cb02"
          },
        })
      .then(response => {
        setNewSeasonal({
          startDate: '',
          endDate: '',
          seasonalPricing: 1,
        });
        displayAlert(2);
      })
      .catch(error => {
        console.error('There was an error submitting default!', error);
      });
    }

    function handleDateClick(arg) {
      const clickedDate = new Date(arg.dateStr);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
       if (clickedDate < today) {
        alert("past dates aren't clickable")
        return;
       }

        setNewEvent({
            ...newEvent,
            allDay: arg.allDay,
            id: new Date().getTime()
        })
        setShowModal(true)
    }

    // function handleDeleteModal() {
    //     setShowDeleteModal(true)
    // }

    const findRecordbyId = (id) => {
      return allEvents.find(event => event.id === id);
    };

    function handleShowEvent(data) {
      console.log(data.event)
      setShowEventModal(true);
      setIdToDelete(parseInt(data.event.id, 10))
      const record = findRecordbyId(parseInt(data.event.id, 10))
      setToShow(record);
    }

    function handleDelete() {
        setAllEvents(prevEvents => prevEvents.filter(event => event.id !== idToDelete))
        console.log(idToDelete)
        console.log(allEvents)
        setShowEventModal(false)
        setIdToDelete(null)
    }

    function handleCloseModal() {
        setShowModal(false)
        setNewEvent({
            title: '',
            start: '',
            end: '',
            phone: '',
            villas: '',
            allDay: true,
            id: 0
        })
        setShowEventModal(false)
        setShowDeleteModal(false)
        setIdToDelete(null)
        setToShow(null)
    }


    return (
        <>
            <main>
                <div className={`z-40 absolute right-0 p-2 w-96 my-4 text-sm text-blue-800 font-alata rounded-lg border border-blue-600 bg-blue-50 ${
                      showAlert ? '' : 'hidden'
                    }`} role="alert"
                >
                  <span className="w-full text-center">Default Pricing changed Successfully!</span>
                </div>
                <div className={`z-40 absolute right-0 p-2 w-96 my-4 text-sm text-blue-800 font-alata rounded-lg border border-blue-600 bg-blue-50 ${
                      showAlertSeasonal ? '' : 'hidden'
                    }`} role="alert"
                >
                  <span className="w-full text-center">Seasonal Pricing changed Successfully!</span>
                </div>
                <div className="mx-12 p-8 px-24 grid grid-cols-10 h-screen">
                    <div className="col-span-7">
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
                            events={allEvents}
                            nowIndicator={true}
                            editable={true}
                            droppable={true}
                            selectable={true}
                            selectMirror={true}
                            fixedWeekCount={false}
                            eventBackgroundColor={"#38ffde"}
                            dateClick={handleDateClick}
                            eventClick={handleShowEvent}
                        />
                    </div>
                    <div className="col-span-2 ml-8 w-max p-8 h-max rounded-md font-alata mt-">
                      <h1 className="text-5xl font-bold text-center pb-8">Pricing Settings</h1>
                        <div className="bg-zinc-100 p-8 rounded-lg">
                          <div className="w-full">
                            <h2 className="text-3xl font-medium font-alata text-center pb-8">Seasonal Pricing</h2>
                          </div>
                          <form action="submit" onSubmit={submitSeasonal}>
                            <div className="flex flex-row gap-4 pb-4">
                              <div className="flex gap-2 items-center">
                                <label htmlFor="startDate">Start</label>
                                <input type="date" id="pricestart" name="startDate" className="p-1 border border-green-600 rounded-md" required
                                  value={newSeasonal.startDate} onChange={handleSeasonalChange}/>
                              </div>
                              <div className="flex gap-2 items-center">
                                <label htmlFor="endDate">End</label>
                                <input type="date" id="priceend" name="endDate" className="p-1 border border-green-600 rounded-md" required
                                  value={newSeasonal.endDate} onChange={handleSeasonalChange}/>
                              </div>
                            </div>
                            <div className="w-full flex flex-row gap-2 justify-center items-center pb-4">
                              <label htmlFor="seasonalPricing">Pricing</label>
                              <input type="number" step="0.01" min="1" placeholder="Enter amount" className="p-1 px-2 border border-green-600 rounded-md" required
                                 name="seasonalPricing" value={newSeasonal.seasonalPricing} onChange={handleSeasonalChange}/>
                            </div>
                            <button
                                    type="submit"
                                    className="
                                      mt-3 inline-flex w-full justify-center rounded-md bg-white
                                      px-3  py-2 text-sm font-semibold text-gray-900 shadow-sm
                                      ring-1 ring-inset ring-green-600 hover:bg-green-600
                                      sm:col-start-1 sm:mt-0"
                                  >
                                    Commit Changes
                            </button>
                          </form>
                        </div>
                        <div className="bg-zinc-100 mt-2 p-8 rounded-lg">
                          <div className="w-full">
                            <h2 className="text-3xl font-medium font-alata text-center pb-8">Default Pricing</h2>
                          </div>
                          <form action="submit" onSubmit={submitDefault}>
                            <div className="w-full flex flex-row gap-2 justify-center items-center pb-4">
                              <label htmlFor="pricing">Pricing</label>
                              <input 
                                type="number"
                                name="pricing"
                                min="1"
                                max="20000"
                                placeholder="1"
                                className="p-1 px-2 border border-green-600 rounded-md"
                                value={newDefault.pricing}
                                onChange={handleDefaultChange}
                              />
                            </div>
                            <button
                                    type="submit"
                                    className="
                                      active:bg-green-300 focus:outline-none focus:ring focus:ring-green-300
                                      mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2
                                      text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset
                                      ring-green-600 hover:bg-green-600 sm:col-start-1 sm:mt-0
                                    "
                                  >
                                    Commit Changes
                            </button>
                          </form>
                        </div>
                        
                    </div>
                </div>
                <div className="bg-zinc-100 mt-2 p-4 py-8 rounded-lg w-full font-alata mx-12">
                  <div className="w-full">
                    <h2 className="text-3xl font-medium font-alata text-center pb-8">Pricing Changes</h2>
                    <div className="seasonal-pricing-list">
                      <h2 className="text-lg font-semibold mb-4">Seasonal Pricing</h2>
                      {allSeasonals.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {allSeasonals.map((seasonal, index) => (
                            <div key={index} className="p-4 border border-gray-300 rounded-md shadow-sm">
                              <p><strong>Start Date:</strong> {new Date(seasonal.startDate).toLocaleDateString()}</p>
                              <p><strong>End Date:</strong> {new Date(seasonal.endDate).toLocaleDateString()}</p>
                              <p><strong>Pricing:</strong> Ksh.{seasonal.seasonalPricing}.00</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No seasonal pricing available.</p>
                      )}
                    </div>
                  </div>
                </div>
                <Transition.Root show={showDeleteModal} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={setShowDeleteModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
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
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg
                                        bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                                    >
                                     <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center 
                      justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Delete Event
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to delete this event?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm 
                      font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={handleDelete}>
                        Delete
                      </button>
                      <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 
                      shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
              </Transition.Root>
              <Transition.Root show={showEventModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setShowEventModal}>
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
                                <Dialog.Title as="h3" className="mb-8 text-base font-semibold leading-6 text-gray-900">
                                  View Reservation.
                                </Dialog.Title>
                                <div className="w-full text-left">
                                  <p><span className="font-bold">Name: </span>{toShow && toShow.title}</p>
                                  <p><span className="font-bold">Phone: </span>{toShow && toShow.phone}</p>
                                  <p><span className="font-bold">Villas: </span>{toShow && toShow.villas}</p>
                                  <p><span className="font-bold">Chek-In Date: </span>{toShow && toShow.start}</p>
                                  <p><span className="font-bold">Check-Out Date: </span>{toShow && toShow.end}</p>
                                </div>
                              </div>
                          </div>
                          <div className="mt-8 flex gap-8 w-full">
                          <button type="button" className="grow inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm 
                            font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto" onClick={handleDelete}>
                              Delete
                            </button>
                          <button type="button" className="grow mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 
                            shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={handleCloseModal}
                            >
                              Cancel
                            </button>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
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
                              <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                              <Dialog.Title as="h3" className="mb-8 text-base font-semibold leading-6 text-gray-900">
                                Make Reservation.
                              </Dialog.Title>
                              <form action="submit" onSubmit={handleSubmit}>
                                <div className="flex items-center gap-4">
                                  <label htmlFor="title" className="font-semibold w-16 text-left">Guest</label>
                                  <input id="guest" type="text" name="title" 
                                  className="
                                    px-2 block w-full rounded-md border-0 py-1 text-gray-900 
                                    shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                    focus:ring-2
                                    focus:ring-inset focus:ring-zinc-600 
                                    sm:text-sm sm:leading-6
                                  "
                                    value={newEvent.title} onChange={handleChange} placeholder="Name of the guest" />
                                </div>
                                <div className="mt-2 flex items-center gap-4">
                                  <label htmlFor="phone" className="font-semibold w-16 text-left">Phone</label>
                                  <input id="phone" type="tel" name="phone" 
                                  className="
                                    px-2 py-1 block w-full rounded-md border-0 text-gray-900 
                                    shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                    focus:ring-2 focus:ring-inset focus:ring-zinc-600 
                                    sm:text-sm sm:leading-6
                                  "
                                    placeholder="0712345678"
                                    value={newEvent.phone} onChange={handleChange}
                                    />
                                </div>
                                <div className="mt-2 flex items-center gap-4">
                                  <label htmlFor="villas" className="font-semibold w-16 text-left">Villas</label>
                                  <input id="villas" type="number" name="villas" 
                                  className="
                                    px-2 py-1 block w-full rounded-md border-0 text-gray-900 
                                    shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                    focus:ring-2 focus:ring-inset focus:ring-zinc-600 
                                    sm:text-sm sm:leading-6
                                  "
                                    placeholder="1" min="1" max="3"
                                    value={newEvent.villas} onChange={handleChange}
                                    />
                                </div>
                                <div className="flex items center gap-4">
                                  <div className="mt-2 flex items-center gap-2">
                                    <label htmlFor="checkin" className="font-semibold">Check-In</label>
                                    <input id="checkout" type="date" name="start" 
                                    className="
                                      px-2 py-1 block rounded-md border-0 text-gray-900 
                                      shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                      focus:ring-2 focus:ring-inset focus:ring-zinc-600 
                                      sm:text-sm sm:leading-6
                                    "
                                      placeholder="" min="" max=""
                                      value={newEvent.start} onChange={handleChange}
                                      />
                                  </div>
                                  <div className="mt-2 flex items-center gap-2">
                                    <label htmlFor="checkout" className="font-semibold">Check-Out</label>
                                    <input id="checkout" type="date" name="end" 
                                    className="
                                      px-2 py-1 block rounded-md border-0 text-gray-900 
                                      shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                      focus:ring-2 focus:ring-inset focus:ring-zinc-600 
                                      sm:text-sm sm:leading-6
                                    "
                                      placeholder="" min="" max=""
                                      value={newEvent.end} onChange={handleChange}
                                      />
                                  </div>
                                </div>
                                <div className="mt-8 sm:mt-8 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                  <button
                                    type="submit"
                                    className="inline-flex w-full justify-center rounded-md bg-zinc-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600 sm:col-start-2 disabled:opacity-25"
                                    disabled={newEvent.title === ''}
                                  >
                                    Reserve
                                  </button>
                                  <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                    onClick={handleCloseModal}

                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
            </main>
        </>
    )
}