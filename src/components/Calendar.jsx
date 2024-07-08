"use client"
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from "@fullcalendar/timegrid";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid";
// import { EventSourceInput } from "@fullcalendar/core/index.js";


export default function Calendar() {
    return (
        <>
            <nav className="text-center">
                <h1>Welcome</h1>
            </nav>
            <main>
                <div className="m-8 p-8">
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
                    />
                </div>
            </main>
        </>
    )
}