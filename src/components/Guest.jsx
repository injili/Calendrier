'use client';

import { Fragment, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';

export default function Guest() {

    const [allEvents, setAllEvents] = useState([])
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: '',
        end: '',
        allDay: true,
        id: 0
    })

    useEffect(() => {
        axios.get('http://localhost:1337/api/reservations',{
            headers:{
                "Content-type": "application/json",
                "Authorization": "Bearer 44f2a2de5c0dfa1243b0e811b0cf485ff07e98213a729ef317411facbd0c9d3b5d6beec68e03944ff90da6dfcbd049d9ab5bab81aa6430e2a13f97617967b75e850a7035903f6b980e9b505505a5e6b4c1b0d741196b35d11fcd8afc6f671f6506b75ebc900ce7a337ffe7f5396972384e41eabad8990510df4cb28f3a52cb02"
            }
        })
        .then(response => {
            const formattedEvents = response.data.data.map(event => ({
                title: event.attributes.title,
                start: event.attributes.start,
                end: event.attributes.end,
                allDay: event.attributes.allDay,
                id: event.id
            }))

            setAllEvents(formattedEvents)
        })
        .catch(error => {
            console.error('There was an error', error)
        })
    }, [])

    return (
        <>
            <div>
                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        interactionPlugin,
                        timeGridPlugin
                    ]}
                    headerToolbar={{
                        left: 'prev, next',
                        center: 'title',
                        right: 'today'
                    }}
                    events={allEvents}
                    nowIndicator={true}
                    editable={true}
                    droppable={true}
                    selectable={true}
                    selectMirror={true}
                />
            </div>
        </>
    );
}