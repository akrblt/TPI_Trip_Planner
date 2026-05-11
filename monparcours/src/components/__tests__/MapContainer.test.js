import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MapContainer from '../MapContainer.vue';
import L from 'leaflet';

// Leaflet Mock (Enhanced for chaining)
vi.mock('leaflet', () => {
  const mapMock = {
    setView: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    removeLayer: vi.fn().mockReturnThis(),
    addLayer: vi.fn().mockReturnThis(),
  };
  return {
    default: {
      map: vi.fn(() => mapMock),
      tileLayer: vi.fn(() => ({ addTo: vi.fn().mockReturnThis() })),
      circleMarker: vi.fn(() => ({
        addTo: vi.fn().mockReturnThis(),
        bindPopup: vi.fn().mockReturnThis(),
        bindTooltip: vi.fn().mockReturnThis(),
        setStyle: vi.fn().mockReturnThis(),
        redraw: vi.fn().mockReturnThis(),
      })),
      polyline: vi.fn(() => ({ addTo: vi.fn().mockReturnThis() })),
      marker: vi.fn(() => ({
        addTo: vi.fn().mockReturnThis(),
        bindPopup: vi.fn().mockReturnThis(),
        openPopup: vi.fn().mockReturnThis(),
      })),
    }
  };
});

describe('MapContainer.vue - Detailed Unit Tests', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    const el = document.createElement('div');
    el.id = 'map';
    document.body.appendChild(el);
    wrapper = mount(MapContainer);
  });

  // --- 1. findMyLocation Tests ---
  describe('findMyLocation()', () => {
    it('Success: should center map when coordinates are provided', () => {
      const mockPosition = { coords: { latitude: 46.8, longitude: 6.6 } };
      global.navigator.geolocation = {
        getCurrentPosition: vi.fn((success) => success(mockPosition))
      };
      wrapper.vm.findMyLocation();
      expect(L.map('map').setView).toHaveBeenCalledWith([46.8, 6.6], 15);
    });

    it('Negative: should show alert when geolocation is unsupported', () => {
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      delete global.navigator.geolocation; // Simulate unsupported browser
      wrapper.vm.findMyLocation();
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining("support geolocalisation"));
    });

    it('Negative: should fallback to Yverdon and alert when user denies permission', () => {
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      global.navigator.geolocation = {
        getCurrentPosition: vi.fn((success, error) => error({ code: 1 })) // Permission denied
      };
      wrapper.vm.findMyLocation();
      expect(L.map('map').setView).toHaveBeenCalledWith([46.7826, 6.6449], 13);
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining("Location denied"));
    });
  });

  // --- 2. drawRoute Tests ---
  describe('drawRoute()', () => {
    it('Success: should draw a line when 2 or more points exist', () => {
      wrapper.vm.etapes = [
        { lat: 46.1, lng: 6.1 },
        { lat: 46.2, lng: 6.2 }
      ];
      wrapper.vm.drawRoute();
      expect(L.polyline).toHaveBeenCalled();
    });

    it('Negative: should alert and not draw if only 1 point exists', () => {
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      wrapper.vm.etapes = [{ lat: 46.1, lng: 6.1 }];
      wrapper.vm.drawRoute();
      expect(alertMock).toHaveBeenCalledWith("Add at least 2 points");
      expect(L.polyline).not.toHaveBeenCalled();
    });

    it('Edge Case: should remove the old route before drawing a new one', () => {
      wrapper.vm.routeLine = { some: 'old-line' }; // Simulate existing line
      wrapper.vm.etapes = [{ lat: 1, lng: 1 }, { lat: 2, lng: 2 }];
      wrapper.vm.drawRoute();
      expect(L.map('map').removeLayer).toHaveBeenCalled();
    });
  });

  // --- 3. updateMarkerColor Tests ---
  describe('updateMarkerColor()', () => {
    it('Success: should update style when marker ID exists', () => {
      const mockMarker = { setStyle: vi.fn(), redraw: vi.fn() };
      wrapper.vm.markerObjects = { 'test-id': mockMarker };
      wrapper.vm.updateMarkerColor({ id: 'test-id', color: '#FF0000' });
      expect(mockMarker.setStyle).toHaveBeenCalledWith(expect.objectContaining({ fillColor: '#FF0000' }));
    });

    it('Negative: should do nothing if marker ID does not exist', () => {
      wrapper.vm.markerObjects = {}; // No markers
      // Calling with non-existent ID should not crash
      expect(() => wrapper.vm.updateMarkerColor({ id: 'wrong-id', color: '#000' })).not.toThrow();
    });

    it('Consistency: should redraw the marker after changing color', () => {
      const mockMarker = { setStyle: vi.fn(), redraw: vi.fn() };
      wrapper.vm.markerObjects = { '123': mockMarker };
      wrapper.vm.updateMarkerColor({ id: '123', color: '#000' });
      expect(mockMarker.redraw).toHaveBeenCalled();
    });
  });


  // --- 4. Map Click (Adding steps) Tests ---
  describe('Map Click Interaction', () => {
    it('Success: should add a new step to the list when map is clicked', () => {
      const initialCount = wrapper.vm.etapes.length;
      // Simulate Leaflet click event
      const mockEvent = { latlng: { lat: 46.7, lng: 6.6 } };
      
      // Trigger the click logic (we access the internal function assigned to myMap.on)
      wrapper.vm.myMap.on.mock.calls.find(call => call[0] === 'click')[1](mockEvent);

      expect(wrapper.vm.etapes.length).toBe(initialCount + 1);
      expect(wrapper.vm.etapes[0].name).toContain("Point");
    });

    it('Success: should create a Leaflet circleMarker when a step is added', () => {
      const mockEvent = { latlng: { lat: 46.7, lng: 6.6 } };
      wrapper.vm.myMap.on.mock.calls.find(call => call[0] === 'click')[1](mockEvent);

      expect(L.circleMarker).toHaveBeenCalled();
    });

    it('Data Integrity: should assign a unique ID (timestamp) to each new step', () => {
      const mockEvent = { latlng: { lat: 46.7, lng: 6.6 } };
      wrapper.vm.myMap.on.mock.calls.find(call => call[0] === 'click')[1](mockEvent);
      
      expect(wrapper.vm.etapes[0].id).toBeDefined();
      expect(typeof wrapper.vm.etapes[0].id).toBe('number');
    });
  });

  // --- 5. loadRoute Tests ---
  describe('loadRoute()', () => {
    it('Success: should restore the steps from provided data', () => {
      const savedData = [
        { id: 101, lat: 46.1, lng: 6.1, color: '#ff0000', name: 'Old Point' }
      ];
      wrapper.vm.loadRoute(savedData);
      
      expect(wrapper.vm.etapes.length).toBe(1);
      expect(wrapper.vm.etapes[0].id).toBe(101);
    });

    it('Cleanup: should remove old markers from the map before loading new ones', () => {
      // Add a fake old marker
      const mockMarker = { addTo: vi.fn() };
      wrapper.vm.markerObjects = { '999': mockMarker };
      
      wrapper.vm.loadRoute([]); // Load empty route
      
      expect(L.map('map').removeLayer).toHaveBeenCalled();
      expect(Object.keys(wrapper.vm.markerObjects).length).toBe(0);
    });

    it('Visual: should redraw markers with correct saved colors', () => {
      const savedData = [{ id: 1, lat: 46, lng: 6, color: '#123456' }];
      wrapper.vm.loadRoute(savedData);
      
      expect(L.circleMarker).toHaveBeenCalledWith(
        [46, 6],
        expect.objectContaining({ fillColor: '#123456' })
      );
    });
  });

});