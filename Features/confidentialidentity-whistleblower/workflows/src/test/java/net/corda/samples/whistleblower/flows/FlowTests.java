package net.corda.samples.whistleblower.flows;

import com.google.common.collect.ImmutableList;
import net.corda.core.concurrent.CordaFuture;
import net.corda.core.transactions.SignedTransaction;
import net.corda.testing.node.MockNetwork;
import net.corda.testing.node.MockNetworkParameters;
import net.corda.testing.node.StartedMockNode;
import net.corda.testing.node.TestCordapp;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.concurrent.ExecutionException;

public class FlowTests {
    private final MockNetwork network = new MockNetwork(new MockNetworkParameters()
            .withCordappsForAllNodes(ImmutableList.of(
                    TestCordapp.findCordapp("net.corda.samples.whistleblower.contracts"),
                    TestCordapp.findCordapp("net.corda.samples.whistleblower.flows"))));
    private final StartedMockNode a = network.createNode();
    private final StartedMockNode b = network.createNode();
    private final StartedMockNode c = network.createNode();

    public FlowTests() {
        ImmutableList.of(a, b).forEach(it -> it.registerInitiatedFlow(BlowWhistleFlowResponder.class));
    }

    @Before
    public void setUp() throws Exception {
        network.startNodes();
    }

    @After
    public void tearDown() {
        network.stopNodes();
    }

    //simple unit test to check the public keys that used in the transaction
    //are different from both mock node a's legal public key and mock node b's legal public key.
    @Test
    public void dummyTest() throws ExecutionException, InterruptedException {
        CordaFuture<SignedTransaction> future = a.startFlow(new BlowWhistleFlow(b.getInfo().getLegalIdentities().get(0), c.getInfo().getLegalIdentities().get(0)));
        network.runNetwork();
        SignedTransaction ptx = future.get();
        assert (!ptx.getTx().getRequiredSigningKeys().contains(a.getInfo().getLegalIdentities().get(0).getOwningKey()));
        assert (!ptx.getTx().getRequiredSigningKeys().contains(b.getInfo().getLegalIdentities().get(0).getOwningKey()));
    }
}
