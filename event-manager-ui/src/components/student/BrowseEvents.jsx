import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { EVENT_CATEGORIES } from '../../utils/constants';
import { useDebounce } from '../../hooks/useDebounce';
import { Card, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import { FormInput, FormSelect } from '../common/FormInput';
import { Loading } from '../common/Loading';
import { Pagination } from '../common/Pagination';
import { Badge, StatusBadge } from '../common/Badge';
import './Student.css';

export const BrowseEvents = () => {
  const { success, error: showError } = useNotification();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [registering, setRegistering] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());
  const [filters, setFilters] = useState({
    category: '',
    dateRange: '',
    organizer: ''
  });

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, loading, refetch } = useFetch(
    () => {
      if (debouncedSearch) {
        return eventService.searchEvents(debouncedSearch, page, 10);
      }
      return eventService.getAllEvents(page, 10, {
        status: 'APPROVED',
        category: filters.category || undefined
      });
    },
    [page, debouncedSearch, filters]
  );

  // Check registration status for all events
  React.useEffect(() => {
    if (data?.content && user?.id) {
      const checkRegistrations = async () => {
        const registered = new Set();
        for (const event of data.content) {
          try {
            const response = await registrationService.checkIfRegistered(event.id, user.id);
            // API returns true if registered, false if not (interceptor unwraps the response)
            if (response?.data === true) {
              registered.add(event.id);
            }
          } catch (err) {
            // Not registered (API returns error if not registered)
          }
        }
        setRegisteredEvents(registered);
      };
      checkRegistrations();
    }
  }, [data?.content, user?.id]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleRegister = async (eventId) => {
    if (!user) {
      showError('Please log in to register for events');
      return;
    }

    try {
      setRegistering(eventId);
      await registrationService.registerForEvent(eventId);
      success('Successfully registered for the event!');
      refetch();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to register for event');
    } finally {
      setRegistering(null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({ category: '', dateRange: '', organizer: '' });
    setPage(0);
  };

  return (
    <div className="browse-events">
      <div className="browse-header">
        <h1>Browse Events</h1>
        <p>Discover and register for exciting college events</p>
      </div>

      <div className="browse-layout">
        <aside className="browse-sidebar">
          <h3>Filters</h3>

          <FormInput
            name="search"
            label="Search Events"
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by title or keywords..."
          />

          <FormSelect
            name="category"
            label="Category"
            value={filters.category}
            onChange={handleFilterChange}
            options={EVENT_CATEGORIES.map(cat => ({
              value: cat,
              label: cat
            }))}
          />

          <Button
            variant="secondary"
            size="small"
            onClick={handleClearFilters}
            className="filter-clear"
          >
            Clear Filters
          </Button>
        </aside>

        <main className="browse-main">
          {loading ? (
            <Loading />
          ) : data?.content?.length > 0 ? (
            <>
              <div className="events-grid">
                {data.content.map(event => (
                  <Card key={event.id} className="event-card clickable">
                    <CardBody>
                      <div className="event-header">
                        <h3>{event.title}</h3>
                        <StatusBadge status={event.status} />
                      </div>

                      <p className="event-description">{event.description?.substring(0, 100)}...</p>

                      <div className="event-meta">
                        <span className="meta-item">📅 {new Date(event.startDateTime).toLocaleDateString()}</span>
                        <span className="meta-item">⏰ {new Date(event.startDateTime).toLocaleTimeString()}</span>
                        <span className="meta-item">📍 {event.location}</span>
                        <span className="meta-item">👥 {event.currentRegistrations}/{event.capacity}</span>
                      </div>

                      <div className="event-capacity">
                        <div className="capacity-bar">
                          <div
                            className="capacity-fill"
                            style={{
                              width: `${(event.currentRegistrations / event.capacity) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="capacity-text">
                          {event.currentRegistrations} / {event.capacity} seats
                        </span>
                      </div>

                      <Button variant="primary" size="small" className="event-btn">
                        View Details
                      </Button>

                      {registeredEvents.has(event.id) ? (
                        <Button
                          variant="secondary"
                          size="small"
                          className="event-btn"
                          disabled
                        >
                          ✓ Already Registered
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          size="small"
                          className="event-btn"
                          onClick={() => handleRegister(event.id)}
                          loading={registering === event.id}
                          disabled={event.currentRegistrations >= event.capacity}
                        >
                          {event.currentRegistrations >= event.capacity ? 'Event Full' : 'Register'}
                        </Button>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={data.totalPages || 1}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="no-events">
              <p>No events found. Try adjusting your filters.</p>
              <Button variant="primary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrowseEvents;
