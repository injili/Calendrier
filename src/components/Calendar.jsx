"use client";
import React from "react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from "@fullcalendar/timegrid";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ExclamationTriangleIcon, HomeModernIcon } from "@heroicons/react/20/solid";



export default function Calendar() {
    const [allEvents, setAllEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [toShow, setToShow] = useState(null)
    const [idToDelete, setIdToDelete] = useState(null)
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: '',
        end: '',
        allDay: true,
        id: 0
    })

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
          allDay: event.attributes.allDay,
          id: event.id
        }));

        setAllEvents(formattedEvents);
        
      })
      .catch(error => {
        console.error('There was an error fetching the events', error);
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


    function handleSubmit(e) {
      e.preventDefault();
      const eventToCreate = {
        data:{
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end,
          allDay: newEvent.allDay,
        }
      };
      setAllEvents(prevEvents => {
        const updatedEvents = [...prevEvents, newEvent];
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
        console.log('Event created:', response.data);
        setAllEvents(prevEvents => [...prevEvents, response.data]);
        setShowModal(false);
        setNewEvent({
          title: '',
          start: '',
          end: '',
          allDay: true,
          id: 0
        })
      })
      .catch(error => {
        console.error('There was an error submitting event!', error);
      });
    }

    // function handleSubmit(e) {
    //     e.preventDefault()
        // setAllEvents(prevEvents => {
        //   const updatedEvents = [...prevEvents, newEvent];
        //   console.log("Updated Events:", updatedEvents);
        //   return updatedEvents;
        // });
    //     // setAllEvents([...allEvents, newEvent])
    //     setShowModal(false)
    //     setNewEvent({
    //         title: '',
    //         start: '',
    //         end: '',
    //         allDay: true,
    //         id: 0
    //     })
    // }

    function handleDateClick(arg) {
      console.log(arg);
        setNewEvent({
            ...newEvent,
            allDay: arg.allDay,
            id: new Date().getTime()
        })
        setShowModal(true)
    }

    function handleDeleteModal() {
        setShowDeleteModal(true)
    }

    function handleShowEvent(data) {
      setShowEventModal(true);
      setToShow(data.event)
      setIdToDelete(data.event.id)
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
                <div className="m-8 p-8 grid grid-cols-10">
                    <div className="col-span-8">
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
                            initialView={"dayGridMonth"}
                            events={allEvents}
                            nowIndicator={true}
                            editable={true}
                            droppable={true}
                            selectable={true}
                            selectMirror={true}
                            dateClick={handleDateClick}
                            eventClick={handleShowEvent}
                        />
                    </div>
                    <div className="col-span-2 ml-8 w-full h-7/12 border-2 p-2 rounded-md mt-16 bg-violet-50">
                        <h1>Settings</h1>
                        <div>
                          <h2>Pick Date</h2>
                          <p>Date Picker Goes Here</p>
                        </div>
                        <div>
                          <h2>Actions</h2>
                          <p>Activate</p>
                          <p>Deactivate</p>
                          <p>Set Pricing</p>
                        </div>
                        <div>
                          <p>Save Changes</p>
                          <p>Reset</p>
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
                            <p><span className="font-bold">Chek-In Date: </span>{toShow && toShow.start.toDateString()}</p>
                            <p><span className="font-bold">Check-Out Date: </span>{toShow && toShow.start.toDateString()}</p>
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
                              focus:ring-inset focus:ring-violet-600 
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
                              focus:ring-2 focus:ring-inset focus:ring-violet-600 
                              sm:text-sm sm:leading-6
                            "
                              placeholder="0712345678"
                              />
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <label htmlFor="villas" className="font-semibold w-16 text-left">Villas</label>
                            <input id="villas" type="number" name="villas" 
                            className="
                              px-2 py-1 block w-full rounded-md border-0 text-gray-900 
                              shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                              focus:ring-2 focus:ring-inset focus:ring-violet-600 
                              sm:text-sm sm:leading-6
                            "
                              placeholder="1" min="1" max="3"
                              />
                          </div>
                          <div className="flex items center gap-4">
                            <div className="mt-2 flex items-center gap-2">
                              <label htmlFor="checkin" className="font-semibold">Check-In</label>
                              <input id="checkout" type="date" name="start" 
                              className="
                                px-2 py-1 block rounded-md border-0 text-gray-900 
                                shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                focus:ring-2 focus:ring-inset focus:ring-violet-600 
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
                                focus:ring-2 focus:ring-inset focus:ring-violet-600 
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
                              className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25"
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