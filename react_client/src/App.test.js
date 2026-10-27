import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockSocket = {
    connected: true,
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
};

jest.mock('./socket', () => ({
    getSocket: () => mockSocket,
}));

const pictures = [
    { id: 1, url: '/imgs/a.jpg', artist: 'Monet', description: 'Water lilies' },
    { id: 2, url: '/imgs/b.jpg', artist: 'Van Gogh', description: 'Starry night' },
];

beforeEach(() => {
    window.location.hash = '';
    localStorage.clear();
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(pictures) })
    );
});

test('renders the gallery from the API', async () => {
    render(<App />);
    expect(await screen.findByText('Monet')).toBeInTheDocument();
    expect(screen.getByText('Van Gogh')).toBeInTheDocument();
});

test('filters pictures by artist name', async () => {
    render(<App />);
    await screen.findByText('Monet');

    userEvent.type(screen.getByLabelText(/search by artist name/i), 'van');

    await waitFor(() => expect(screen.queryByText('Monet')).not.toBeInTheDocument());
    expect(screen.getByText('Van Gogh')).toBeInTheDocument();
});

test('shows an error when the API fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('network down')));
    render(<App />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't load the gallery/i);
});

test('opens the discussion for a picture and joins its room', async () => {
    window.location.hash = '#/picture/2';
    render(<App />);

    expect(await screen.findByText('Discussion')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Van Gogh' })).toBeInTheDocument();
    await waitFor(() => expect(mockSocket.emit).toHaveBeenCalledWith('joinPicture', 2));
});

test('sends a chat message to the current picture', async () => {
    window.location.hash = '#/picture/1';
    render(<App />);
    expect(await screen.findByText('Live')).toBeInTheDocument();

    userEvent.type(screen.getByLabelText('Your name'), 'Dana');
    userEvent.type(screen.getByLabelText('Message'), 'Beautiful colors{enter}');

    expect(mockSocket.emit).toHaveBeenCalledWith('newMessage', {
        pictureId: 1,
        text: 'Beautiful colors',
        author: 'Dana',
    });
});
