import './TicketList.css'
import {useParams} from "react-router-dom";
import React, { useEffect, useState } from 'react'
import ClockLoader from "react-spinners/ClockLoader";
import { useDispatch, useSelector } from 'react-redux'
import { getTicketsForOneRide, changeStatus } from '../../../slices/ticketsSlice'
import { fetchRides } from '../../../slices/ridesSlice'

function TicketList() {
  const dispatch = useDispatch();
  let { businessId } = useParams();
  const { areLoading } = useSelector((store) => store.ticketsReducer);
  let tickets = useSelector(store => getTicketsForOneRide(store, businessId))
  const [allStatus, setAllStatus] = useState({ 'waiting': null, 'done': null, 'cancelled': null })
  const { waiting, done, cancelled } = allStatus

  useEffect(() => {
    const fetchRidesWrapper = async () => dispatch(fetchRides());
    fetchRidesWrapper();
    updateStatus();
  }, [JSON.stringify(tickets)])

  const updateStatus = () => {
    const allStatusCopy = { ...allStatus }
    if (tickets.length != 0) {
      for (const status in allStatusCopy) {
        const ticketsWithAStatus = tickets.filter(ticket => ticket.status == status)
        allStatusCopy[status] = ticketsWithAStatus.length;
        setAllStatus(allStatusCopy)
      }
    }
  }

  const handleClick = async (event) => {
    const id = event.currentTarget.id
    const status = tickets.find(ticket => ticket.ticketId == id).status
    if (status === 'waiting') dispatch(changeStatus({id, status:'called'}))
    if (status === 'called') dispatch(changeStatus({ id, status: 'done' }))
  }

  const handleCancel = async (event) => {
    const id = event.currentTarget.id
    const status= tickets.find(ticket => ticket.ticketId == id).status
    if (status == 'called') dispatch(changeStatus({ id, status: 'cancelled' }))
  }

  const override = {display: "block",position: "absolute",top: "50%",left: "45%",margin: "0 auto",borderColor: "red",};
  if (areLoading) 
    return <ClockLoader color={'#4A90E2'} loading={areLoading} size={100} cssOverride={override} />
  if (!tickets || tickets.length == 0)
    return <h3>No Queue For Your Restaurant</h3>
  
  return (
    <>
      <div className="ticketlist--display">
        <h3 className="ticketList--Heading"> Your Queue </h3>
        <div className='stat-wrapper'>
          <div className="ticketList--stat ticketlist-waiting"> <strong>Waiting :</strong>  {waiting}</div>
          <div className="ticketList--stat ticketlist-done"> <strong> Done : </strong> {done}</div>
          <div className="ticketList--stat ticketlist-cancelled"> <strong> Cancelled : </strong> {cancelled}</div>
        </div>
      </div>
      <div className="list__container">
        {tickets
         ?.filter(ticket => (['waiting', 'called'].includes(ticket.status)))
          .map((ticket,index) => {
          return (
            <div  className="card queue-info-card" key={index}>
              <div className='row'>
                <div className='column column-your-queue-ticket-number'>
                  <h4 className='text'> Ticket number :</h4> <h4 className='text your-queue-number-text'> {ticket.ticketId}</h4>
                </div>
                <div className="column column--your-queue-status">
                  <p className='text'> Status : </p>
                  <p className={`colored-text-box ${ticket.status == 'called' ? "colored-text-box--green" : "colored-text-box--yellow"}`}>{ticket.status}</p>
                </div>
              </div>
              <div className='row'>
                <button className='button ' id={ticket.ticketId} status={ticket.status} onClick={handleClick}>
                  {ticket.status === 'waiting' ? 'Call' :  'Arrived' || ticket.status=='called' ? 'Confrim Arrival' : null}
                </button>
                {ticket.status=='called'
                ?<button className='button button--cancel'id={ticket.ticketId} onClick={handleCancel}>Cancel</button>
                : null}
              </div>
            </div>
          )}
        )}
      </div>
    </>)
  }
  export default TicketList
