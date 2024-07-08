"use client"
import React from "react";
import { Fragment, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from "@fullcalendar/timegrid";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid";


export default function Calendar() {
    const [events, setEvents] = useState([
        {title: 'Villa 1', id: '1'},
        {title: 'Villa 2', id: '2'},
        {title: 'Villa 3', id: '3'},
    ])
    const [allEvents, setAllEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState(null)
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: '',
        allDay: false,
        id: 0
    })
    useEffect(() => {
        let draggableEl = document.getElementById('draggable-el')
        if (draggableEl) {
            new Draggable(draggableEl, {
                itemSelector: ".fc-event",
                eventData: function (eventEl) {
                    let title = eventEl.getAttribute("title")
                    let id = eventEl.getAttribute("data")
                    let start = eventEl.getAttribute("start")
                    return { title, id, start}
                }
            })
        }
    }, [])

    function handleDateClick(arg) {
        setNewEvent({
            ...newEvent,
            start: arg.date,
            allDay: arg.allDay,
            id: new Date().getTime()
        })
        setShowModal(true)
    }

    function addEvent(data) {
        const event = {
            ...newEvent,
            start: data.data.toISOString(),
            title: data.draggedEl.innerText,
            allDay: data.allDay,
            id: new Date().getTime()
        }
        setAllEvents([...allEvents, event])
    }

    function handleDeleteModal(data) {
        setShowDeleteModal(true)
        setIdToDelete(Number(data.event.id))
    }

    function handleDelete() {
        setAllEvents(allEvents.filter(event => Number(event.id) !== Number(idToDelete)))
        setShowDeleteModal(false)
        setIdToDelete(null)
    }

    function handleCloseModal() {
        setShowModal(false)
        setNewEvent({
            title: '',
            start: '',
            allDay: false,
            id: 0
        })
        setShowDeleteModal(false)
        setIdToDelete(null)
    }

    const handleChange = (e) => {
        setNewEvent({
            ...newEvent,
            title: e.target.value
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        setAllEvents([...allEvents, newEvent])
        setShowModal(false)
        setNewEvent({
            title: '',
            start: '',
            allDay: false,
            id: 0
        })
    }


    return (
        <>
            <nav className="text-center">
                <h1>Welcome</h1>
            </nav>
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
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth, timeGridWeek, timeGridDay'
                            }}
                            initialView={"dayGridMonth"}
                            events={allEvents}
                            nowIndicator={true}
                            editable={true}
                            droppable={true}
                            selectable={true}
                            selectMirror={true}
                            dateClick={handleDateClick}
                            drop={(data) => addEvent(data)}
                            eventClick={(data) => handleDeleteModal(data)}
                        />
                    </div>
                    <div id="draggable-el" className="col-span-2 ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50">
                        <h1>Drag Event</h1>
                        {events.map(event => (
                            <div 
                                className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white"
                                title={event.title}
                                key={event.id}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>

                <Transition.Root show={showDeleteModal} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={setShowDeleteModal}>
                        <Transition.Child
                        ></Transition.Child>
                    </Dialog>
                </Transition.Root>
            </main>
        </>
    )
}